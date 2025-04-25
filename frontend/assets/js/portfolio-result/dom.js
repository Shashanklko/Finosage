// DOM manipulation functions
import { HORIZON_LABELS, RISK_TOLERANCE_LABELS } from './constants.js';

/**
 * Updates all UI elements with portfolio data
 * @param {Object} userInputs - User preferences and demographics
 * @param {Object} allocation - Portfolio allocation percentages
 * @param {Object} metrics - Calculated portfolio metrics
 */
export function updateUI(userInputs, allocation, metrics) {
    // Update summary cards
    updateSummaryCards(userInputs);
    
    // Update metric values
    updateMetricValues(metrics);
    
    // Update investment strategy section
    generateInvestmentStrategy(userInputs, allocation, metrics);
    
    // Update investment tips section
    generateInvestmentTips(userInputs, metrics);
}

/**
 * Updates summary cards with user input data
 * @param {Object} userInputs - User preferences and demographics
 */
function updateSummaryCards(userInputs) {
    const { investmentGoal, investmentHorizon, riskTolerance, preferences } = userInputs;
    
    // Update investment mode
    document.querySelector('.investment-mode').textContent = 
        investmentGoal === 'growth' ? 'Growth' : 'Income';
    
    // Update investment horizon
    document.querySelector('.investment-horizon').textContent = 
        HORIZON_LABELS[investmentHorizon] || 'Not specified';
    
    // Update investment style
    document.querySelector('.investment-style').textContent = 
        preferences ? preferences.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ') : 'Not specified';
    
    // Update risk profile
    document.querySelector('.risk-profile').textContent = 
        RISK_TOLERANCE_LABELS[riskTolerance] || 'Not specified';
}

/**
 * Updates metric value displays
 * @param {Object} metrics - Calculated portfolio metrics
 */
function updateMetricValues(metrics) {
    const { expectedReturn, sharpeRatio, maxDrawdown, volatility } = metrics;
    
    // Update expected return
    document.querySelector('.expected-return').textContent = `${expectedReturn}%`;
    
    // Update Sharpe ratio
    document.querySelector('.sharpe-ratio').textContent = sharpeRatio.toFixed(2);
    
    // Update maximum drawdown
    document.querySelector('.max-drawdown').textContent = `${maxDrawdown}%`;
    
    // Update volatility
    document.querySelector('.volatility').textContent = `${volatility}%`;
}

/**
 * Generates and displays investment strategy recommendations
 * @param {Object} userInputs - User preferences and demographics
 * @param {Object} allocation - Portfolio allocation percentages
 * @param {Object} metrics - Calculated portfolio metrics
 */
function generateInvestmentStrategy(userInputs, allocation, metrics) {
    const strategyContainer = document.querySelector('.investment-strategy');
    const { riskTolerance, investmentHorizon, age } = userInputs;
    const { stocks = 0, bonds = 0, crypto = 0, 'mutual-funds': mutualFunds = 0 } = allocation;
    
    let strategy = '';
    
    // Basic strategy based on risk tolerance
    strategy += `<div class="strategy-item">${RISK_TOLERANCE_LABELS[riskTolerance]} approach with `;
    strategy += `${stocks}% in stocks and ${bonds}% in fixed income</div>`;
    
    // Time horizon recommendation
    strategy += `<div class="strategy-item">${HORIZON_LABELS[investmentHorizon]} investment strategy `;
    strategy += `suitable for ${investmentHorizon} time horizons</div>`;
    
    // Age-based recommendation
    if (age < 30) {
        strategy += '<div class="strategy-item">Early career focus: prioritize growth and take advantage of long time horizon</div>';
    } else if (age < 50) {
        strategy += '<div class="strategy-item">Mid-career strategy: balance growth with increasing stability</div>';
    } else {
        strategy += '<div class="strategy-item">Pre-retirement phase: focus on capital preservation and income generation</div>';
    }
    
    // Asset class recommendations
    if (stocks > 50) {
        strategy += '<div class="strategy-item">Focus on high-quality blue-chip stocks for stability</div>';
    }
    if (bonds > 30) {
        strategy += '<div class="strategy-item">Consider government and high-grade corporate bonds</div>';
    }
    if (crypto > 0) {
        strategy += '<div class="strategy-item">Limit crypto exposure to well-established coins</div>';
    }
    if (mutualFunds > 0) {
        strategy += '<div class="strategy-item">Focus on mutual funds with low expense ratios and consistent performance</div>';
    }
    
    // Rebalancing strategy
    strategy += '<div class="strategy-item">Rebalance portfolio quarterly to maintain target allocation</div>';
    
    strategyContainer.innerHTML = strategy;
}

/**
 * Generates and displays personalized investment tips
 * @param {Object} userInputs - User preferences and demographics
 * @param {Object} metrics - Calculated portfolio metrics
 */
function generateInvestmentTips(userInputs, metrics) {
    const tipsContainer = document.querySelector('.investment-tips');
    const { riskTolerance, investmentHorizon, initialInvestment } = userInputs;
    const { expectedReturn, riskScore } = metrics;
    
    let tips = '';
    
    // Risk-based tips
    if (riskScore > 7) {
        tips += '<div class="tip-item">Consider setting stop-loss orders to protect against market volatility</div>';
    }
    
    // Investment amount tips
    if (initialInvestment < 50000) {
        tips += '<div class="tip-item">Focus on low-cost index funds to minimize fees on smaller portfolios</div>';
    } else {
        tips += '<div class="tip-item">Consider tax-advantaged investment vehicles for larger portfolios</div>';
    }
    
    // Return expectations
    tips += `<div class="tip-item">With ${expectedReturn}% expected return, your investment could double in approximately ${Math.round(72/expectedReturn)} years</div>`;
    
    // Horizon-based tips
    if (investmentHorizon === 'short') {
        tips += '<div class="tip-item">Maintain higher cash reserves for short-term goals</div>';
    } else if (investmentHorizon === 'long') {
        tips += '<div class="tip-item">Consider dollar-cost averaging for long-term investments</div>';
    }
    
    // General tips
    tips += '<div class="tip-item">Diversify across sectors and geographies to reduce concentration risk</div>';
    tips += '<div class="tip-item">Review and adjust your portfolio as your financial goals evolve</div>';
    
    // Add mutual fund specific tips
    if (initialInvestment > 10000) {
        tips += '<div class="tip-item">Consider SIP (Systematic Investment Plan) for regular mutual fund investments</div>';
    }
    
    tipsContainer.innerHTML = tips;
} 