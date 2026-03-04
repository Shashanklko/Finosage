import React from 'react';
import { motion } from 'framer-motion';

const explanations = [
    {
        title: 'Plan Success Rate',
        text: 'The probability of meeting all high-priority goals within their target timelines. Computed via smart planning calculations.',
        icon: '◉'
    },
    {
        title: 'Per-Goal Probability',
        text: 'Each goal gets an independent success rate based on capital allocation, timeline, and priority weighting from the optimization.',
        icon: '◈'
    },
    {
        title: 'Priority Support',
        text: 'Important goals get funded first. Goals you marked as flexible are funded with what remains.',
        icon: '◇'
    },
    {
        title: 'Automatic Safety Guard',
        text: 'Your investments automatically shift from growth-focused to safety-focused as each goal gets closer, protecting your savings.',
        icon: '▬'
    },
    {
        title: 'Market Crash Simulation',
        text: 'Simulates interacting market forces and severe crashes to see how they impact your goals simultaneously.',
        icon: '△'
    },
    {
        title: 'Goal Progress Over Time',
        text: 'Shows how much money is building up for each goal. Steeper curves mean you\'re saving faster.',
        icon: '◎'
    },
    {
        title: 'What-If Analysis',
        text: 'Compares your current plan against an ideal plan to show how adding more savings could help achieve all goals.',
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
