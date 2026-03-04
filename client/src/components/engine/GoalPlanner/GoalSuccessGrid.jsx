import React from 'react';
import { motion } from 'framer-motion';

const getProbColor = (prob) => {
    if (prob >= 90) return '#34D399';
    if (prob >= 75) return '#d4af37';
    return '#F87171';
};

const GoalSuccessGrid = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <motion.div
            className="goal-success-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
        >
            {data.map((goal, i) => (
                <div key={i} className="goal-success-card">
                    <span className={`goal-card-priority ${goal.priority}`}>{goal.priority}</span>
                    <p className="goal-success-value" style={{ color: getProbColor(goal.probability) }}>
                        {goal.probability}%
                    </p>
                    <p className="goal-success-name">{goal.name}</p>
                    <p className="goal-success-target">
                        Target: {goal.target} · Saved: {goal.funded}
                    </p>
                </div>
            ))}
        </motion.div>
    );
};

export default GoalSuccessGrid;
