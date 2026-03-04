import React from 'react';
import { motion } from 'framer-motion';

const explanations = [
    {
        title: 'Best Spending Rate',
        text: 'The ideal yearly spending rate that balances your lifestyle while ensuring your money lasts throughout retirement.',
        icon: '◉'
    },
    {
        title: 'Adjustable Spending',
        text: 'Spending limits that automatically adjust. When markets are good, you can spend more. When markets are slow, spending decreases slightly to protect your savings.',
        icon: '◈'
    },
    {
        title: 'Savings Success Rate',
        text: 'The percentage of simulated scenarios where your money lasts for your entire retirement. Tested against severe crashes to ensure safety.',
        icon: '◇'
    },
    {
        title: 'Stress Scenarios',
        text: 'Each scenario modifies return/inflation assumptions to test robustness. PASS (>85%), CAUTION (60-85%), RISK (<60%) thresholds apply.',
        icon: '▬'
    },
    {
        title: 'Market Timing Risk',
        text: 'Bad markets early in retirement are more risky than later ones. Our model accounts for this and adjusts your plan to minimize this risk.',
        icon: '△'
    },
    {
        title: 'Savings Lifespan',
        text: 'Shows how your savings change over time under your chosen plan. The goal is to keep the line above zero for your entire life.',
        icon: '◎'
    },
    {
        title: 'Spending Schedule',
        text: 'A year-by-year guide of how much you can spend. Includes warnings if you need to reduce spending to preserve your savings.',
        icon: '▥'
    },
    {
        title: 'Smart Optimization',
        text: 'Advanced math that solves your retirement plan by working backward from your final goals to find the best starting point.',
        icon: '∫'
    },
];

const WithdrawalExplainer = () => {
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

export default WithdrawalExplainer;
