import React from 'react';
import { motion } from 'framer-motion';

const SimulationSummary = ({ formData }) => {
    if (!formData) return null;
    const params = [
        { label: 'Simulation Paths', value: (formData.numPaths || 10000).toLocaleString() },
        { label: 'Return Assumption', value: `${formData.expectedReturn}%` },
        { label: 'Volatility', value: `${formData.volatility}%` },
        { label: 'Inflation Modeled', value: `${formData.inflationRate}%` },
        { label: 'Withdrawal Strategy', value: formData.strategy?.charAt(0).toUpperCase() + formData.strategy?.slice(1) },
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
