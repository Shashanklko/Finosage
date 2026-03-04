import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#d4af37', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

import { formatINR, formatINRShort } from '../../../utils/formatCurrency';

const GoalFundingChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    // Extract goal keys (exclude 'year')
    const goalKeys = Object.keys(data[0]).filter(k => k !== 'year');

    return (
        <motion.div
            className="engine-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
        >
            <h3 className="engine-chart-title">Goal Funding Trajectories</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                    <defs>
                        {goalKeys.map((key, i) => (
                            <linearGradient key={key} id={`gradGoal${i}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3} />
                                <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" strokeOpacity={0.5} />
                    <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#1F2937' }} tickLine={false}
                        label={{ value: 'Years', position: 'bottom', fill: '#4B5563', fontSize: 10, offset: -5 }} />
                    <YAxis tickFormatter={formatINRShort} tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip contentStyle={{ background: 'rgba(11,15,28,0.95)', border: '1px solid #1F2937', borderRadius: 8, fontSize: '0.7rem' }}
                        formatter={(val) => [formatINR(val), '']} />
                    {goalKeys.map((key, i) => (
                        <Area key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} fill={`url(#gradGoal${i})`} strokeWidth={1.5} />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export default GoalFundingChart;
