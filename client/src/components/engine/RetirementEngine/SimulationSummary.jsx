import React from 'react';
import { motion } from 'framer-motion';

const SimulationSummary = ({ formData }) => {
    if (!formData) return null;
    const params = [
        { label: 'Number of Scenarios', value: (formData.numPaths || 10000).toLocaleString() },
        { label: 'Expected Growth', value: `${formData.expectedReturn}%` },
        { label: 'Market Risk', value: `${formData.volatility}%` },
        { label: 'Rising Cost of Living', value: `${formData.inflationRate}%` },
        { label: 'Spending Strategy', value: formData.strategy?.charAt(0).toUpperCase() + formData.strategy?.slice(1) },
    ];

    return (
        <motion.div
            className="engine-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
        >
            <h3 className="engine-chart-title">Simulation Summary</h3>
            <div className="engine-summary-grid">
                {params.map((param, i) => (
                    <div key={i} className="engine-summary-item">
                        <p className="sum-value">{param.value}</p>
                        <p className="sum-label">{param.label}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default SimulationSummary;
