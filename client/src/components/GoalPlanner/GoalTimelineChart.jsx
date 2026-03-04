import React from 'react';
import { motion } from 'framer-motion';

const GoalTimelineChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <motion.div
            className="engine-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            <h3 className="engine-chart-title">Goal Timeline & Funding Progress</h3>
            <div className="timeline-bar-wrap">
                {data.map((goal, i) => (
                    <div key={i} className="timeline-row">
                        <span className="timeline-label">{goal.name}</span>
                        <div className="timeline-bar-bg">
                            <div
                                className="timeline-bar-fill"
                                style={{
                                    width: `${(goal.years / goal.maxYears) * 100}%`,
                                    background: `linear-gradient(90deg, ${goal.color}44, ${goal.color})`,
                                }}
                            >
                                {goal.probability}%
                            </div>
                        </div>
                        <span className="timeline-year">{goal.years} yrs</span>
                    </div>
                ))}
            </div>
            <p className="engine-insight">
                Goals are sorted by priority and timeline. Higher-priority goals receive capital
                first in the Dynamic Programming allocation to maximize overall success probability.
            </p>
        </motion.div>
    );
};

export default GoalTimelineChart;
