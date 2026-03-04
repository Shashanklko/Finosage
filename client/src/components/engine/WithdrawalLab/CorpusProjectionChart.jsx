import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatINR, formatINRShort } from '../../../utils/formatCurrency';

const CorpusProjectionChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <motion.div
            className="engine-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
        >
            <h3 className="engine-chart-title">Savings Lifespan Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                    <defs>
                        <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d4af37" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" strokeOpacity={0.5} />
                    <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#1F2937' }} tickLine={false}
                        label={{ value: 'Year', position: 'bottom', fill: '#4B5563', fontSize: 10, offset: -5 }} />
                    <YAxis tickFormatter={formatINRShort} tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                    <Tooltip contentStyle={{ background: 'rgba(11,15,28,0.95)', border: '1px solid #1F2937', borderRadius: 8, fontSize: '0.7rem' }}
                        formatter={(val, name) => [formatINR(val), name === 'corpus' ? 'Savings' : 'Yearly Spending']} />
                    <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="3 3" strokeOpacity={0.5} label={{ value: 'OUT OF MONEY', fill: '#EF4444', fontSize: 9, position: 'right' }} />
                    <Area type="monotone" dataKey="corpus" stroke="#d4af37" fill="url(#corpusGrad)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export default CorpusProjectionChart;
