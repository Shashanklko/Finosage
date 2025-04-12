 // Portfolio metrics calculation functions

/**
 * Calculates key portfolio metrics based on allocation and user inputs
 * @param {Object} userInputs - User preferences and demographics
 * @param {Object} allocation - Portfolio allocation percentages
 * @returns {Object} Calculated metrics (returns, risk, volatility, etc.)
 */
export function calculateMetrics(userInputs, allocation) {
    const { age, riskTolerance, investmentHorizon, initialInvestment } = userInputs;
    const { stocks = 0, bonds = 0, crypto = 0, etfs = 0, cash = 0 } = allocation;
    
    // Calculate expected return based on asset allocation
    const expectedReturn = calculateExpectedReturn(allocation);
    
    // Calculate risk score (1-10 scale)
    const riskScore = calculateRiskScore(allocation, riskTolerance);
    
    // Calculate volatility
    const volatility = calculateVolatility(allocation);
    
    // Calculate Sharpe ratio (risk-adjusted return)
    const sharpeRatio = calculateSharpeRatio(expectedReturn, volatility);
    
    // Calculate maximum drawdown
    const maxDrawdown = calculateMaxDrawdown(allocation, riskTolerance);
    
    return {
        expectedReturn,
        riskScore,
        volatility,
        sharpeRatio,
        maxDrawdown
    };
}

/**
 * Calculates expected annual return based on asset allocation
 * @param {Object} allocation - Portfolio allocation percentages
 * @returns {number} Expected annual return percentage
 */
function calculateExpectedReturn(allocation) {
    const { stocks = 0, bonds = 0, crypto = 0, etfs = 0, cash = 0 } = allocation;
    
    // Expected returns for each asset class (historical averages)
    const returns = {
        stocks: 8.0,   // 8% annual return for stocks
        bonds: 3.0,    // 3% for bonds
        crypto: 15.0,  // 15% for crypto (higher risk/return)
        etfs: 7.0,     // 7% for ETFs
        cash: 1.0      // 1% for cash/money market
    };
    
    // Weighted average return
    let expectedReturn = 0;
    Object.keys(allocation).forEach(asset => {
        expectedReturn += (allocation[asset] / 100) * (returns[asset] || 0);
    });
    
    return parseFloat(expectedReturn.toFixed(1));
}

/**
 * Calculates risk score on a scale of 1-10
 * @param {Object} allocation - Portfolio allocation percentages
 * @param {string} riskTolerance - User's risk tolerance level
 * @returns {number} Risk score (1-10)
 */
function calculateRiskScore(allocation, riskTolerance) {
    const { stocks = 0, crypto = 0 } = allocation;
    
    // Base risk from allocation
    let riskScore = (stocks * 0.08) + (crypto * 0.15);
    
    // Adjust based on user's risk tolerance
    const riskAdjustment = {
        'conservative': -1,
        'moderate': 0,
        'aggressive': 1
    };
    
    riskScore += riskAdjustment[riskTolerance] || 0;
    
    // Ensure risk score is within 1-10 range
    return Math.min(10, Math.max(1, parseFloat(riskScore.toFixed(1))));
}

/**
 * Calculates expected portfolio volatility
 * @param {Object} allocation - Portfolio allocation percentages
 * @returns {number} Expected annual volatility percentage
 */
function calculateVolatility(allocation) {
    const { stocks = 0, bonds = 0, crypto = 0, etfs = 0, cash = 0 } = allocation;
    
    // Historical volatility for each asset class
    const volatilities = {
        stocks: 15.0,  // 15% volatility for stocks
        bonds: 5.0,    // 5% for bonds
        crypto: 40.0,  // 40% for crypto
        etfs: 12.0,    // 12% for ETFs
        cash: 0.5      // 0.5% for cash
    };
    
    // Weighted average volatility (simplified, ignoring correlations)
    let portfolioVolatility = 0;
    Object.keys(allocation).forEach(asset => {
        portfolioVolatility += Math.pow((allocation[asset] / 100) * (volatilities[asset] || 0), 2);
    });
    
    return parseFloat(Math.sqrt(portfolioVolatility).toFixed(1));
}

/**
 * Calculates Sharpe ratio (risk-adjusted return)
 * @param {number} expectedReturn - Expected annual return percentage
 * @param {number} volatility - Expected annual volatility percentage
 * @param {number} riskFreeRate - Risk-free rate percentage (default: 1%)
 * @returns {number} Sharpe ratio
 */
function calculateSharpeRatio(expectedReturn, volatility, riskFreeRate = 1.0) {
    if (volatility === 0) return 0;
    return parseFloat(((expectedReturn - riskFreeRate) / volatility).toFixed(2));
}

/**
 * Calculates expected maximum drawdown
 * @param {Object} allocation - Portfolio allocation percentages
 * @param {string} riskTolerance - User's risk tolerance level
 * @returns {number} Expected maximum drawdown percentage
 */
function calculateMaxDrawdown(allocation, riskTolerance) {
    const { stocks = 0, crypto = 0 } = allocation;
    
    // Historical max drawdowns (simplified)
    let maxDrawdown = (stocks * 0.5) / 100;  // Stocks might lose 50% in severe downturn
    maxDrawdown += (crypto * 0.8) / 100;    // Crypto might lose 80% in severe downturn
    
    // Adjust based on risk tolerance
    const drawdownMultiplier = {
        'conservative': 0.8,
        'moderate': 1.0,
        'aggressive': 1.2
    };
    
    maxDrawdown *= drawdownMultiplier[riskTolerance] || 1.0;
    
    // Express as percentage
    return parseFloat((maxDrawdown * 100).toFixed(1));
}