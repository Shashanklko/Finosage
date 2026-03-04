import React from 'react';
import { motion } from 'framer-motion';

const explanations = [
    {
        title: 'Overall Achievement',
        text: 'The probability of meeting all high-priority goals within their target timelines. Computed via backward induction on the DP value function.',
        icon: '◉'
    },
    {
        title: 'Per-Goal Probability',
        text: 'Each goal gets an independent success rate based on capital allocation, timeline, and priority weighting from the optimization.',
        icon: '◈'
    },
    {
        title: 'Priority Weighting',
        text: 'High-priority goals receive capital first in the DP allocation tree. Lower-priority goals are funded with residual capacity.',
        icon: '◇'
    },
    {
        title: 'Dynamic Glide Path',
        text: 'Asset allocation automatically shifts from Equity to Debt as goals approach their target years, reducing volatility and protecting accumulated capital.',
        icon: '▬'
    },
    {
        title: 'Correlated Asset Shocks',
        text: 'Simulates interacting market forces by applying Cholesky decomposition to Equity and Debt volatility, ensuring realistic market relationships.',
        icon: '△'
    },
    {
        title: 'Funding Trajectory',
        text: 'Shows the cumulative capital allocated to each goal over time. Steeper curves indicate faster funding; plateaus indicate goal completion.',
        icon: '◎'
    },
    {
        title: 'Tradeoff Analysis',
        text: 'Compares your current plan against the DP-optimized allocation to show how much additional savings or reallocation would achieve all goals.',
        icon: '▥'
    },
];

const GoalExplainer = () => {
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

export default GoalExplainer;
