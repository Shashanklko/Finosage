import React from 'react';
import { motion } from 'framer-motion';
import { formatINR } from '../../../utils/formatCurrency';

const SparklineSVG = ({ survivalRate }) => {
    const width = 120, height = 50;
    // Generate decay curve from survival rate
    const points_arr = [];
    for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const val = survivalRate * (1 - t * t * (1 - survivalRate / 100));
        points_arr.push(val);
    }
    const maxVal = Math.max(...points_arr);
    const minVal = Math.min(...points_arr);
    const range = maxVal - minVal || 1;
    const points = points_arr.map((val, i) => {
        const x = (i / (points_arr.length - 1)) * width;
        const y = height - ((val - minVal) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} style={{ opacity: 0.4 }}>
            <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={`0,${height} ${points} ${width},${height}`} fill="url(#sparkGrad)" />
            <polyline points={points} fill="none" stroke="#d4af37" strokeWidth="1.5" />
        </svg>
    );
};

const HeroStatCard = ({ data }) => {
    if (!data) return null;
    const subMetrics = [
        { label: 'Total Savings at Retirement', value: data.corpusAtRetirement ? formatINR(data.corpusAtRetirement) : '—' },
        { label: 'Likely Savings Left Over', value: formatINR(data.medianCorpus) },
        { label: 'Sustainable Spending Rate', value: `${data.safeWithdrawalRate}%` },
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
                        {data.survivalRate}<span className="hero-percent">%</span>
                    </div>
                    <p className="hero-stat-label">Retirement Success Score</p>
                    <p className="hero-stat-desc">
                        Your money lasts as long as you need it in {Math.round(data.survivalRate * 100)} of 10,000 simulated scenarios.
                    </p>
                </div>
                <div>
                    <p className="hero-sparkline-label">MONEY LIFESPAN</p>
                    <SparklineSVG survivalRate={data.survivalRate} />
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

export default HeroStatCard;
