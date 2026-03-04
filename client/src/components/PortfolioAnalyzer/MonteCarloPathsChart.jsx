import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatINR, formatINRShort } from '../../utils/formatCurrency';

const MonteCarloPathsChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    const numPaths = data.length;
    const numYears = data[0]?.length || 0;

    // Build chart data: each row = {year, p0, p1, ..., pN, median}
    const chartData = [];
    for (let yr = 0; yr < numYears; yr++) {
        const point = { year: yr };
        const values = [];
        data.forEach((path, i) => {
            const val = path[yr]?.value || 0;
            point[`p${i}`] = val;
            values.push(val);
        });
        values.sort((a, b) => a - b);
        point.median = values[Math.floor(values.length / 2)];
        chartData.push(point);
    }

    return (
        <motion.div
            className="engine-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
        >
            <h3 className="port-chart-title">Future Wealth Projections (10,000 Scenarios)</h3>
            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" strokeOpacity={0.5} />
                    <XAxis
                        dataKey="year"
                        tick={{ fill: '#6B7280', fontSize: 11 }}
                        axisLine={{ stroke: '#1F2937' }}
                        tickLine={false}
                        label={{ value: 'Years', position: 'bottom', fill: '#4B5563', fontSize: 10, offset: -5 }}
                    />
                    <YAxis
                        tickFormatter={formatINRShort}
                        tick={{ fill: '#6B7280', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={65}
                    />
                    <Tooltip
                        contentStyle={{ background: 'rgba(11,15,28,0.95)', border: '1px solid #1F2937', borderRadius: 8, fontSize: '0.7rem' }}
                        formatter={(val) => [formatINR(val), '']}
                    />
                    {Array.from({ length: numPaths }, (_, i) => (
                        <Line
                            key={i}
                            type="monotone"
                            dataKey={`p${i}`}
                            stroke="#1F2937"
                            strokeWidth={0.5}
                            dot={false}
                            strokeOpacity={0.4}
                        />
                    ))}
                    <Line type="monotone" dataKey="median" stroke="#d4af37" strokeWidth={2.5} dot={false} />
                </LineChart>
            </ResponsiveContainer>
            <div className="mc-paths-legend">
                <span><span className="mc-legend-dot" style={{ background: '#d4af37' }} /> Median Path</span>
                <span><span className="mc-legend-dot" style={{ background: '#374151' }} /> Individual Simulations ({numPaths})</span>
            </div>
        </motion.div>
    );
};

export default MonteCarloPathsChart;
