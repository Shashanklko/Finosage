import React from 'react';
import { motion } from 'framer-motion';

const explanations = [
    {
        title: 'Expected CAGR',
        text: 'Compound Annual Growth Rate derived from the mean of all simulated portfolio paths. Accounts for drift and volatility drag in the GBM model.',
        icon: '◉'
    },
    {
        title: 'Portfolio Volatility (σ)',
        text: 'Annualized standard deviation of portfolio returns. Computed from the asset covariance matrix weighted by your allocation.',
        icon: '◈'
    },
    {
        title: 'Sharpe Ratio',
        text: 'Risk-adjusted return metric: (Portfolio Return − Risk-Free Rate) / σ. A Sharpe above 1.0 indicates strong risk-adjusted performance.',
        icon: '◇'
    },
    {
        title: 'Efficient Frontier',
        text: 'The set of portfolios offering maximal return for each risk level. Portfolios below the frontier are sub-optimal.',
        icon: '▬'
    },
    {
        title: 'Value at Risk (VaR)',
        text: 'The maximum expected loss at 95% confidence over a 1-year horizon. Only 5% of simulated scenarios produce a worse outcome.',
        icon: '△'
    },
    {
        title: 'Max Drawdown',
        text: 'The largest peak-to-trough decline observed across all simulation paths. Measures the worst-case capital erosion.',
        icon: '◎'
    },
    {
        title: 'Correlation Matrix',
        text: 'Shows how asset classes move together. Negative correlations provide natural hedging and reduce portfolio risk through diversification.',
        icon: '▥'
    },
    {
        title: 'GBM SDE Model',
        text: 'Geometric Brownian Motion: dS = μS·dt + σS·dW. Captures drift (expected growth) and stochastic volatility with correlated Wiener processes.',
        icon: '∫'
    },
];

const PortfolioExplainer = () => {
    return (
        <motion.div
            className="explainer-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            <div className="explainer-card">
                <h3 className="explainer-title">Analysis Guide</h3>
                <div className="explainer-divider" />
                <div className="explainer-list">
                    {explanations.map((item, i) => (
                        <div key={i} className="explainer-item">
                            <span className="explainer-icon">{item.icon}</span>
                            <div>
                                <p className="explainer-item-title">{item.title}</p>
                                <p className="explainer-item-text">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default PortfolioExplainer;
