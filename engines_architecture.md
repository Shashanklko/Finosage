# Finosage Analytical Engines Architecture

This document details the mathematical models, statistical techniques, and practical scenarios for the four core financial engines powering Finosage.

---

## 1. Retirement Wealth Engine
**Core Methodology:** Dynamic Regime-Switching Monte Carlo Simulation

### How It Works
The Retirement engine projects wealth accumulation and depletion over a user's lifetime, accounting for extreme market conditions and variable inflation. Unlike standard deterministic models, it recognizes that financial markets alternate between normal "growth" periods and chaotic "stress" periods.

### Math & Statistics
*   **Markov Regime-Switching Returns:** The simulation maintains a state machine with two regimes: Growth and Stress.
    *   *Growth Regime (Normal):* Uses the user's expected return ($\mu$) and volatility ($\sigma$).
    *   *Stress Regime (Crash):* Models severe downturns. Expected return ($\mu_s$) becomes negative (e.g., $-0.6 \times \sigma$), and volatility ($\sigma_s$) expands significantly (e.g., $1.8 \times \sigma$).
    *   *Transition Matrix:* The probability of staying in Growth is ~92% ($P_{GG}$), while the probability of staying in Stress is ~70% ($P_{SS}$), reflecting sticky but transient bear markets.
*   **Fat-Tail Sampling (Student-t):** Instead of using a standard Normal (Gaussian) distribution, returns are sampled using a Student-t distribution with $\nu$ (degrees of freedom) set to 5. This accurately models the "fat tails" (outlier events like Black Monday or the 2008 financial crisis) prevalent in real financial data.
*   **Stochastic Inflation:** Inflation is not static. In Stress regimes, there is a higher probability of jumping into a High Inflation regime (e.g., 1.5x normal inflation), eroding purchasing power dynamically during market crashes.

### Example Scenario
**User Profile:** 35-year-old, planning to retire at 60, expecting to live to 90. Current corpus: ₹50L, Annual withdrawal needed: ₹12L.
**Simulation Path:** The simulation runs 10,000 parallel lifetimes. In one specific path, the market performs well until year 12, when the Markov chain transitions into a Stress regime for 3 years. The Student-t sampling generates a severe -28% year, accompanied by a spike in inflation to 9%. The engine tracks whether the user's dynamic guardrail spending rules (adjusting withdrawals down slightly) allow the remaining corpus to survive until age 90 despite the sequence risk.

---

## 2. Portfolio Analyzer
**Core Methodology:** Regime-Switching Quasi-Monte Carlo (QMC) + Dynamic Correlation

### How It Works
This engine projects the growth of a multi-asset portfolio (Large Cap, Mid/Small, International, Debt, Gold, REITs, etc.) by modeling the behavior of different asset classes simultaneously and mapping how they interact during different market cycles.

### Math & Statistics
*   **Quasi-Monte Carlo (Sobol Sequence):** Instead of pseudo-random numbers, it uses a Sobol sequence to generate evenly distributed, low-discrepancy points. This drastically improves convergence rates and provides highly stable median projections across dimensions (assets $\times$ years).
*   **Dynamic Correlation & Cholesky Decomposition:** 
    *   *Growth Regime:* Assets have normal baseline correlations (e.g., Equities and Debt have near zero or negative correlation). The engine applies a Cholesky Decomposition ($L L^T = \Sigma$) to map independent standard normal variables onto correlated asset returns.
    *   *Stress Regime:* During market panics, cross-asset correlations tend to converge toward 1.0. The engine dynamically modifies the covariance matrix during stress regimes, increasing equity-to-equity and equity-to-REIT correlations by +0.20 (capped at 0.95), simulating systemic contagion.

### Example Scenario
**User Profile:** ₹1Cr invested in a Moderate risk profile (60% Equities, 30% Debt, 10% Gold), horizon 10 years.
**Simulation Path:** In a projected growth year, Large caps return 12% and Debt returns 7%. However, in a simulated stress year, the dynamic correlation matrix forces both Mid Cap and International Equities to crash simultaneously. The Cholesky decomposition ensures the Gold allocation acts as a non-correlated stabilizer, limiting maximum drawdown strictly based on the correlation constraints.

---

## 3. Wealth Goal Planner
**Core Methodology:** Goal Prioritization Dynamic Programming + Asset Glide Path QMC

### How It Works
The Goal Planner maps a user's cash flow against multiple concurrent financial goals (e.g., buying a home in 5 years, funding education in 12 years). It automatically adjusts the asset allocation to become safer as each goal approaches.

### Math & Statistics
*   **Dynamic Glide Path:** The equity allocation ($w_{eq}$) automatically steps down every year (e.g., -1.5% per year) to reduce sequence-of-return risk as the user approaches their target dates, eventually flattening to a conservative floor (20%).
*   **Correlated Two-Asset Model:** Capital is modeled as a blend of Equity ($\mu_{eq}=12\%$, $\sigma_{eq}=18\%$) and Debt ($\mu_{debt}=7\%$, $\sigma_{debt}=5\%$) with a specific correlation factor (0.10). 
*   **Dynamic Programming (Waterfall Funding):** Once the Monte Carlo paths project the total corpus for a given year, a greedy dynamic programming approach allocates funds:
    *   Goals are sorted first by User Priority (High > Med > Low), then by Timeline (Shortest first).
    *   The median simulated corpus available at year $T$ is used to "fund" the highest priority goal. The remaining capital is carried forward to evaluate the funding probability of lower-priority goals.

### Example Scenario
**User Profile:** Monthly savings ₹50k. Goals: Buy a Car in 3 years (₹10L) and a House in 8 years (₹80L).
**Simulation Path:** The QMC engine runs 4,096 paths. Because the car is only 3 years away, the glide path logic reduces equity exposure early. By year 3, the engine determines an 85% probability of having the ₹10L. The algorithm subtracts the exact median funded amount from the simulation corpus and continues compounding the remaining balance forward to year 8, concluding the user only has a 45% probability of funding the house without increasing SIPs.

---

## 4. Withdrawal Strategy Lab
**Core Methodology:** Multi-scenario Stress Testing + Dynamic Spending Guardrails

### How It Works
The Withdrawal Lab stress-tests a retirement corpus against historically dangerous scenarios that break traditional "4% rule" models, ensuring sustainable cash flows.

### Math & Statistics
*   **Stochastic Overlays (Stress Shocks):** Base QMC returns are generated with geometric Brownian motion ($\mu = 10\%$, $\sigma = 15\%$). The engine then applies deterministic overrides for specific scenarios:
    *   *Market Crash:* Injects a deterministic shock magnitude (-40%) explicitly at Year 2, simulating a devastating crash immediately after retiring.
    *   *Stagflation:* Concurrently shifts the mean return distribution down ($\mu - 4\%$) and shifts inflation up (Inflation + 4%) for the entire trajectory.
    *   *Sequence of Returns (SoR) Bias:* Artificially shifts the standard normal $Z$-scores downward by $1.5 \sigma$ for specifically the first 5 years of retirement, creating a structural "bad start" scenario.
*   **Dynamic Guardrails Algorithm:** Instead of fixed absolute withdrawals, the engine recalculates boundaries yearly:
    *   Upper Bound: Baseline Withdrawal $\times 1.2$
    *   Lower Bound: Baseline Withdrawal $\times 0.75$
    *   Target: `Corpus * 0.041`. Withdrawals are dynamically clipped specifically within these upper/lower guardrails to preserve capital during crashes while ensuring standard of living.

### Example Scenario
**User Profile:** 60-year-old with ₹3Cr corpus, target withdrawal ₹12L/year, Guardrail Strategy.
**Simulation Path:** Testing the "Poor Sequence of Returns" scenario. While the baseline scenario shows a 95% survival rate, the sequence path forces grueling -5% returns for the first 5 years. A fixed withdrawal strategy would deplete the corpus by year 15. However, the simulation's Guardrail logic dynamically detects the shrinking corpus, automatically clamping the year 3-5 withdrawals to the 0.75x lower bound (₹9L). This prevents early capital cannibalization, resulting in the portfolio surviving to year 30 despite the atrocious start.
