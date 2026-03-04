import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload) {
        return (
            <div className="engine-chart-tooltip">
                <p className="tip-label">Year {label}</p>
                <p className="tip-red">{payload[0]?.value} depletion events</p>
            </div>
        );
    }
    return null;
};

const FailureChart = ({ data, startAge = 60 }) => {
    if (!data || data.length === 0) {
        return (
            <motion.div
                className="engine-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
            >
                <h3 className="engine-chart-title">Failure Year Distribution</h3>
                <p className="engine-insight" style={{ textAlign: 'center', padding: '2rem 0' }}>
                    No depletion events detected — your portfolio survives all 10,000 simulations! 🎉
                </p>
            </motion.div>
        );
    }

    const chartData = data.map(d => ({
        age: startAge + d.year,
        count: d.count,
    }));
    const maxCount = Math.max(...chartData.map(d => d.count));

    return (
        <motion.div
            className="engine-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
        >
            <h3 className="engine-chart-title">Failure Year Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" strokeOpacity={0.5} />
                    <XAxis dataKey="age" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#1F2937' }} tickLine={false} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={index} fill={entry.count > maxCount * 0.8 ? '#EF4444' : entry.count > maxCount * 0.5 ? '#F87171' : '#374151'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export default FailureChart;
