import React from 'react';
import { motion } from 'framer-motion';
import { formatINR } from '../../utils/formatCurrency';

const PortfolioSummaryCard = ({ data }) => {
    if (!data) return null;
    const subMetrics = [
        { label: 'Risk-Adjusted Score (Sharpe)', value: data.sharpeRatio },
        { label: 'Worst-Case Drop', value: `${data.maxDrawdown}%` },
        { label: 'Max Likely 1-Year Loss', value: formatINR(data.var95) },
    ];

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
                        {data.cagr}<span className="hero-percent">%</span>
                    </div>
                    <p className="hero-stat-label">Expected Yearly Growth</p>
                    <p className="hero-stat-desc">
                        Projected average return across thousands of simulated life paths, factoring in market crashes and boom periods.
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p className="hero-sparkline-label">RISK LEVEL</p>
                    <div className="hero-stat-value" style={{ fontSize: '2.5rem' }}>
                        {data.volatility}<span className="hero-percent" style={{ fontSize: '1.5rem' }}>%</span>
                    </div>
                    <p style={{ fontSize: '0.55rem', color: '#6B7280', letterSpacing: '0.2em' }}>YEARLY TURBULENCE</p>
                </div>
            </div>
            <div className="hero-sub-metrics">
                {subMetrics.map((m, i) => (
                    <div key={i} className="hero-sub-metric">
                        <p className="sub-value">{m.value}</p>
                        <p className="sub-label">{m.label}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default PortfolioSummaryCard;
