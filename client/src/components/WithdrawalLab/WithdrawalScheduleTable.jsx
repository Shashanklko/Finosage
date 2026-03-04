import React from 'react';
import { motion } from 'framer-motion';

const WithdrawalScheduleTable = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <motion.div
            className="engine-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
        >
            <h3 className="engine-chart-title">Optimized Withdrawal Schedule</h3>
            <table className="schedule-table">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Age</th>
                        <th>Withdrawal</th>
                        <th>Corpus</th>
                        <th>Rate</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i}>
                            <td>{row.year}</td>
                            <td>{row.age}</td>
                            <td style={{ color: '#E5E7EB' }}>{row.withdrawal}</td>
                            <td style={{ color: '#d4af37' }}>{row.corpus}</td>
                            <td style={{ color: parseFloat(row.rate) > 15 ? '#F87171' : '#9CA3AF' }}>{row.rate}</td>
                            <td style={{ color: '#FCD34D', fontSize: '0.55rem' }}>{row.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="engine-insight">
                "Guardrail ↓" indicates the strategy dynamically reduced withdrawals.
                "Floor hit" means withdrawals are at the minimum guardrail boundary.
            </p>
        </motion.div>
    );
};

export default WithdrawalScheduleTable;
