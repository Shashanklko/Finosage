import React from 'react';
import { motion } from 'framer-motion';
import { formatINR } from '../../../utils/formatCurrency';

const RiskStatGrid = ({ data, summary, dynamicMetrics }) => {
    if (!data) return null;

    const dm = dynamicMetrics || {};

    const stats = [
        { value: formatINR(summary?.medianFinal || 0), label: 'Likely Money Left Over', colorClass: '' },
        { value: `${data.failureRate}%`, label: 'Risk of Running Out of Money', colorClass: data.failureRate > 20 ? 'text-red' : 'text-green' },
        { value: `${data.realReturn}%`, label: 'Average Growth (After Inflation)', colorClass: '' },
        { value: `${data.sequenceRisk}%`, label: 'Market Timing Risk', colorClass: data.sequenceRisk > 10 ? 'text-red' : '' },
        { value: dm.healthScore != null ? `${dm.healthScore}` : '—', label: 'Health Score /100', colorClass: dm.healthScore >= 75 ? 'text-green' : dm.healthScore >= 50 ? '' : 'text-red' },
        { value: dm.minSustainableReturn != null ? `${dm.minSustainableReturn}%` : '—', label: 'Minimum Growth Needed', colorClass: '' },
    ];

    return (
        <motion.div
            className="engine-stat-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
        >
            {stats.map((stat, i) => (
                <div key={i} className="engine-stat-card">
                    <p className={`engine-stat-value ${stat.colorClass}`}>{stat.value}</p>
                    <p className="engine-stat-label">{stat.label}</p>
                </div>
            ))}
        </motion.div>
    );
};

export default RiskStatGrid;
