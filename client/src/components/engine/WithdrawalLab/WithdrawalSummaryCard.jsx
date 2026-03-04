import React from 'react';
import { motion } from 'framer-motion';
import { formatINR } from '../../../utils/formatCurrency';

const WithdrawalSummaryCard = ({ data }) => {
    if (!data) return null;

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
                        {data.optimalRate}<span className="hero-percent">%</span>
                    </div>
                    <p className="hero-stat-label">Best Spending Rate</p>
                    <p className="hero-stat-desc">
                        A smart, safe spending rate that preserves your savings
                        across thousands of simulated market paths with adjustable protections.
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p className="hero-sparkline-label">SAVINGS SUCCESS</p>
                    <div className="hero-stat-value" style={{ fontSize: '2.5rem' }}>
                        {data.survivalRate}<span className="hero-percent" style={{ fontSize: '1.5rem' }}>%</span>
                    </div>
                    <p style={{ fontSize: '0.55rem', color: '#6B7280', letterSpacing: '0.2em' }}>NORMAL MARKET SCENARIO</p>
                </div>
            </div>
            <div className="hero-sub-metrics">
                <div className="hero-sub-metric">
                    <p className="sub-value">{formatINR(data.year1Withdrawal)}/yr</p>
                    <p className="sub-label">Year 1 Spending</p>
                </div>
                <div className="hero-sub-metric">
                    <p className="sub-value">{formatINR(data.medianCorpus15)}</p>
                    <p className="sub-label">Likely Savings @ Year 15</p>
                </div>
                <div className="hero-sub-metric">
                    <p className="sub-value">{data.buffer} Years</p>
                    <p className="sub-label">Longevity Buffer</p>
                </div>
            </div>
        </motion.div>
    );
};

export default WithdrawalSummaryCard;
