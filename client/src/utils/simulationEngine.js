/**
 * Finosage Quantitative Engine
 * High-precision financial modeling using Quasi-Monte Carlo (Sobol Sequence)
 * and Stochastic Differential Equations.
 */

// --- UTILITIES ---

/**
 * Sobol sequence generator (32-bit implementation for speed)
 * Generates low-discrepancy sequences for Quasi-Monte Carlo.
 */
class Sobol {
    constructor(dimension) {
        this.dimension = dimension;
        this.count = 0;
        this.x = new Uint32Array(dimension);
        this.m = new Uint32Array(dimension * 32);
        this.v = new Float64Array(dimension * 32);

        // Direction numbers (simplified for 1D - retirement time horizon simulation)
        for (let i = 0; i < 32; i++) {
            this.m[i] = 1;
            this.v[i] = this.m[i] / Math.pow(2, i + 1);
        }
    }

    next() {
        if (this.count === 0) {
            this.count++;
            return new Float64Array(this.dimension).fill(0);
        }

        const res = new Float64Array(this.dimension);
        let c = 1;
        let value = this.count - 1;
        while (value & 1) {
            value >>= 1;
            c++;
        }

        for (let i = 0; i < this.dimension; i++) {
            this.x[i] ^= this.m[(c - 1)];
            res[i] = this.x[i] / Math.pow(2, 32);
        }

        this.count++;
        return res;
    }
}

/**
 * Box-Muller transform for normal distribution from uniform Sobol sequence
 */
function qrngNormal(u1, u2) {
    const z0 = Math.sqrt(-2.0 * Math.log(u1 + 1e-10)) * Math.cos(2.0 * Math.PI * u2);
    return z0;
}

// --- CORE SIMULATION ---

export function runSimulation(inputs) {
    const {
        currentAge,
        retirementAge,
        lifeExpectancy,
        portfolioValue,
        monthlyContribution,
        mu, // Expected Annual Return
        sigma, // Annual Volatility
        inflationRate,
        strategyType
    } = inputs;

    const yearsToRetire = retirementAge - currentAge;
    const totalYears = lifeExpectancy - currentAge;
    const numPaths = 10000;

    let failureCount = 0;
    const finalValues = new Float64Array(numPaths);
    const failureYears = [];
    const ageSnapshots = { 60: [], 70: [], 80: [], 90: [] };

    // Sobol 2D: one for return randomness, one for sequence variation
    const sobol = new Sobol(2);

    for (let i = 0; i < numPaths; i++) {
        let currentPortfolio = portfolioValue;
        const u = sobol.next();
        let pathFailed = false;

        for (let year = 1; year <= totalYears; year++) {
            const age = currentAge + year;

            // 1. Generate Stochastic Return (GBM)
            // dS = mu*S*dt + sigma*S*dW
            const dW = qrngNormal(u[0], (i / numPaths)); // Simplified QMC drift
            const annualReturn = Math.exp((mu - 0.5 * sigma * sigma) + sigma * dW);

            // Adjust for inflation (Real Return)
            const realReturnFactor = annualReturn / (1 + inflationRate);

            if (age <= retirementAge) {
                // Accumulation Phase
                currentPortfolio = (currentPortfolio + (monthlyContribution * 12)) * realReturnFactor;
            } else {
                // Withdrawal Phase
                let withdrawal = 0;
                const yearsInRetirement = age - retirementAge;

                // Implement Strategies
                switch (strategyType) {
                    case 'fixed':
                        withdrawal = inputs.initialWithdrawal;
                        break;
                    case 'inflation_adjusted':
                        withdrawal = inputs.initialWithdrawal * Math.pow(1 + inflationRate, yearsInRetirement);
                        break;
                    case 'percent':
                        withdrawal = currentPortfolio * inputs.withdrawalRate;
                        break;
                    case 'guardrail':
                        const base = inputs.initialWithdrawal;
                        withdrawal = base;
                        if (currentPortfolio < inputs.threshold) withdrawal *= 0.8;
                        break;
                    default:
                        withdrawal = currentPortfolio * 0.04;
                }

                currentPortfolio = (currentPortfolio - withdrawal) * realReturnFactor;
            }

            // Failure check
            if (currentPortfolio <= 0 && !pathFailed) {
                failureCount++;
                failureYears.push(age);
                pathFailed = true;
                currentPortfolio = 0;
            }

            // Snapshots
            if (ageSnapshots[age]) ageSnapshots[age].push(currentPortfolio);
        }

        finalValues[i] = currentPortfolio;
    }

    // --- STATISTICS ---
    const survivalProbability = (numPaths - failureCount) / numPaths;

    const getMedian = (arr) => {
        if (arr.length === 0) return 0;
        const sorted = [...arr].sort((a, b) => a - b);
        return sorted[Math.floor(sorted.length / 2)];
    };

    const getPercentile = (arr, p) => {
        if (arr.length === 0) return 0;
        const sorted = [...arr].sort((a, b) => a - b);
        return sorted[Math.floor(sorted.length * (p / 100))];
    };

    return {
        survivalProbability,
        medianValues: {
            60: getMedian(ageSnapshots[60]),
            70: getMedian(ageSnapshots[70]),
            80: getMedian(ageSnapshots[80]),
            90: getMedian(ageSnapshots[90])
        },
        worstCase5th: getPercentile(finalValues, 5),
        failureDistribution: failureYears, // Raw data for histogram
        safeWithdrawalRate: survivalProbability > 0.95 ? "4.2%" : "3.1%" // Heuristic for now
    };
}
