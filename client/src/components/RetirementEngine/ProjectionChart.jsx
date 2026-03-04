import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatINR, formatINRShort } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="engine-chart-tooltip">
                <p className="tip-label">Year {label}</p>
                <p className="tip-gold">Average: {formatINR(payload[0]?.value)}</p>
                {payload[2] && <p className="tip-blue">Best Case: {formatINR(payload[2]?.value)}</p>}
                {payload[1] && <p className="tip-red">Worst Case: {formatINR(payload[1]?.value)}</p>}
            </div>
        );
    }
    return null;
};

const ProjectionChart = ({ data, startAge = 60 }) => {
    if (!data || data.length === 0) return null;

    const chartData = data.map(d => ({
        age: startAge + d.year,
        median: d.median,
        p10: d.p10,
        p90: d.p90,
    }));

    return (
        <motion.div
            className="engine-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
        >
            <h3 className="engine-chart-title">Projected Portfolio Value Over Time</h3>
            <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                    <defs>
                        <linearGradient id="medianGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d4af37" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.08} />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" strokeOpacity={0.5} />
                    <XAxis dataKey="age" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#1F2937' }} tickLine={false} />
                    <YAxis tickFormatter={formatINRShort} tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="median" stroke="#d4af37" strokeWidth={2} fill="url(#medianGrad)" />
                    <Area type="monotone" dataKey="p10" stroke="#EF4444" strokeWidth={0.5} strokeDasharray="4 4" fill="url(#bandGrad)" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="p90" stroke="#3B82F6" strokeWidth={0.5} strokeDasharray="4 4" fill="url(#bandGrad)" fillOpacity={0.3} />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export default ProjectionChart;
