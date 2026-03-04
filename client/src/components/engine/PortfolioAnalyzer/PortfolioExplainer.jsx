import React from 'react';
import { motion } from 'framer-motion';

const explanations = [
    {
        title: 'Yearly Growth (CAGR)',
        text: 'Average annual growth rate derived from thousands of simulated market paths. Accounts for both good years and bad years.',
        icon: '◉'
    },
    {
        title: 'Market Turbulence (Risk)',
        text: 'Measure of how much your portfolio value might swing up and down in a typical year.',
        icon: '◈'
    },
    {
        title: 'Risk-Adjusted Score',
        text: 'Calculates if you\'re getting enough return for the level of risk you\'re taking. A score above 1.0 is considered strong.',
        icon: '◇'
    },
    {
        title: 'Best-Risk-Balance Plan',
        text: 'The ideal mix of investments that gives you the highest possible growth for any given level of risk.',
        icon: '▬'
    },
    {
        title: 'Likely Maximum Loss',
        text: 'The most you might expect to lose in a single bad year based on normal market movements (95% confidence).',
        icon: '△'
    },
    {
        title: 'Worst-Case Drop',
        text: 'The largest possible fall from top to bottom observed across simulated scenarios. Measures the "crash" potential.',
        icon: '◎'
    },
    {
        title: 'Asset Relationship Chart',
        text: 'Shows how different investments move together. Having assets that move differently helps reduce your overall risk.',
        icon: '▥'
    },
    {
        title: 'Growth & Risk Model',
        text: 'Advanced math model that captures both the steady climb of growth and the sudden, random jumps of market risk.',
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
