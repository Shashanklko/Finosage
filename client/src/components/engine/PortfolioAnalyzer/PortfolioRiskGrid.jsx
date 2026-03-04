import React from 'react';
import { motion } from 'framer-motion';
import { formatINR } from '../../../utils/formatCurrency';

const PortfolioRiskGrid = ({ data, dynamicMetrics }) => {
    if (!data) return null;

    const dm = dynamicMetrics || {};

    const stats = [
        { value: data.sharpe, label: 'Risk-Adjusted Score', colorClass: '' },
        { value: data.sortino, label: 'Downside Protection', colorClass: '' },
        { value: formatINR(data.var95), label: 'Likely Maximum Loss', colorClass: 'text-red' },
        { value: `${data.maxDrawdown}%`, label: 'Worst-Case Drop', colorClass: 'text-red' },
        { value: `${dm.diversificationScore ?? 0}%`, label: 'Diversification Score', colorClass: 'text-green' },
        { value: `${dm.probabilityOfLoss ?? 0}%`, label: 'Risk of Loss', colorClass: dm.probabilityOfLoss > 20 ? 'text-red' : '' },
    ];

    return (
        <motion.div
            className="port-risk-grid"
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

export default PortfolioRiskGrid;
