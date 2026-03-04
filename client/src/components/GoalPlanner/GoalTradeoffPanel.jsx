import React from 'react';
import { motion } from 'framer-motion';

const GoalTradeoffPanel = ({ data }) => {
    if (!data) return null;

    const scenarios = [
        {
            title: 'Current Plan',
            desc: 'Based on your current savings rate and allocation',
            metrics: [
                { label: 'Monthly Savings', value: data.current?.savings },
                { label: 'Goals Achieved', value: data.current?.goals },
                { label: 'Overall Probability', value: data.current?.probability },
                { label: 'Shortfall', value: data.current?.shortfall },
            ],
            highlight: false,
        },
        {
            title: 'Optimized Plan',
            desc: 'System-optimized allocation with dynamic target-date glide path',
            metrics: [
                { label: 'Monthly Savings', value: data.optimized?.savings },
                { label: 'Goals Achieved', value: data.optimized?.goals },
                { label: 'Overall Probability', value: data.optimized?.probability },
                { label: 'Shortfall', value: data.optimized?.shortfall },
            ],
            highlight: true,
        },
    ];

    return (
        <motion.div
            className="tradeoff-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
        >
            {scenarios.map((scenario, i) => (
                <div
                    key={i}
                    className="engine-card"
                    style={scenario.highlight ? {
                        borderColor: 'rgba(212, 175, 55, 0.3)',
                        background: 'rgba(212, 175, 55, 0.03)',
                    } : {}}
                >
                    <h3 className="engine-chart-title" style={scenario.highlight ? { color: '#d4af37' } : {}}>
                        {scenario.title}
                    </h3>
                    <p style={{ fontSize: '0.65rem', color: '#4B5563', marginBottom: '1.5rem', marginTop: '-1rem' }}>
                        {scenario.desc}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {scenario.metrics.map((m, j) => (
                            <div key={j} style={{ textAlign: 'center' }}>
                                <p style={{
                                    fontSize: '1.2rem', fontWeight: 300,
                                    color: scenario.highlight && j === 2 ? '#34D399' : '#fff',
                                }}>{m.value}</p>
                                <p style={{ fontSize: '0.5rem', color: '#6B7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.3rem' }}>
                                    {m.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </motion.div>
    );
};

export default GoalTradeoffPanel;
