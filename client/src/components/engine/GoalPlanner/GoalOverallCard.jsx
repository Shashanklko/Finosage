import React from 'react';
import { motion } from 'framer-motion';
import { formatINR } from '../../../utils/formatCurrency';

const GoalOverallCard = ({ data }) => {
    if (!data) return null;
    const funded = data.goalsFunded || '0/0';
    const parts = funded.split('/');

    return (
        <motion.div
            className="engine-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className="engine-card-glow" />
            <div className="hero-stat-layout">
                <div>
                    <div className="hero-stat-value">
                        {data.achievementRate}<span className="hero-percent">%</span>
                    </div>
                    <p className="hero-stat-label">Plan Success Rate</p>
                    <p className="hero-stat-desc">
                        Probability of achieving all important goals within their
                        target timelines, using a smart market simulation that
                        factors in both growth and safety.
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p className="hero-sparkline-label">GOALS FUNDED</p>
                    <div className="hero-stat-value" style={{ fontSize: '2.5rem' }}>
                        {parts[0]}<span className="hero-percent" style={{ fontSize: '1.5rem' }}>/{parts[1]}</span>
                    </div>
                    <p style={{ fontSize: '0.55rem', color: '#6B7280', letterSpacing: '0.2em' }}>FULLY ACHIEVABLE</p>
                </div>
            </div>
            <div className="hero-sub-metrics">
                <div className="hero-sub-metric">
                    <p className="sub-value">{formatINR(data.totalValue)}</p>
                    <p className="sub-label">Total Amount Needed</p>
                </div>
                <div className="hero-sub-metric">
                    <p className="sub-value">{data.longestHorizon} Years</p>
                    <p className="sub-label">Time to Final Goal</p>
                </div>
                <div className="hero-sub-metric">
                    <p className="sub-value">{formatINR(data.requiredSavings)}/yr</p>
                    <p className="sub-label">Required Yearly Savings</p>
                </div>
            </div>
        </motion.div>
    );
};

export default GoalOverallCard;
