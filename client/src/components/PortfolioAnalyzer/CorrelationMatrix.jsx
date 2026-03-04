import React from 'react';
import { motion } from 'framer-motion';

const getCellColor = (val) => {
    if (val === 1) return 'rgba(212, 175, 55, 0.2)';
    if (val > 0.6) return 'rgba(59, 130, 246, 0.25)';
    if (val > 0.3) return 'rgba(59, 130, 246, 0.12)';
    if (val > 0) return 'rgba(59, 130, 246, 0.05)';
    if (val > -0.15) return 'transparent';
    return 'rgba(239, 68, 68, 0.12)';
};

const getTextColor = (val) => {
    if (val === 1) return '#d4af37';
    if (val < 0) return '#F87171';
    return '#9CA3AF';
};

const CorrelationMatrix = ({ data }) => {
    if (!data) return null;
    const { labels, matrix } = data;

    return (
        <motion.div
            className="engine-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
        >
            <h3 className="engine-chart-title">How Your Assets Move Together</h3>
            <div className="port-chart-divider" />

            <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
                <table className="corr-matrix" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th></th>
                            {labels.map((a, i) => <th key={i}>{a}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {labels.map((row, i) => (
                            <tr key={i}>
                                <th style={{ textAlign: 'left', paddingRight: '1rem' }}>{row}</th>
                                {matrix[i].map((val, j) => (
                                    <td
                                        key={j}
                                        style={{
                                            background: getCellColor(val),
                                            color: getTextColor(val),
                                            padding: '0.5rem',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {val.toFixed(2)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="engine-insight" style={{ marginTop: '1.5rem' }}>
                Negative numbers (red) mean assets move in opposite directions, acting as a shield during market crashes. Positive numbers (blue) mean they move together.
            </p>
        </motion.div>
    );
};

export default CorrelationMatrix;
