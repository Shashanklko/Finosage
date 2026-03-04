import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { formatINR, formatINRShort } from '../../utils/formatCurrency';

const GuardrailChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <motion.div
            className="engine-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
        >
            <h3 className="engine-chart-title">Dynamic Guardrail Withdrawal Bounds</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" strokeOpacity={0.5} />
                    <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#1F2937' }} tickLine={false}
                        label={{ value: 'Year', position: 'bottom', fill: '#4B5563', fontSize: 10, offset: -5 }} />
                    <YAxis tickFormatter={formatINRShort} tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip contentStyle={{ background: 'rgba(11,15,28,0.95)', border: '1px solid #1F2937', borderRadius: 8, fontSize: '0.7rem' }}
                        formatter={(val) => [formatINR(val), '']} />
                    <Line type="monotone" dataKey="upper" stroke="#34D399" strokeWidth={1} strokeDasharray="5 3" dot={false} />
                    <Line type="monotone" dataKey="lower" stroke="#F87171" strokeWidth={1} strokeDasharray="5 3" dot={false} />
                    <Line type="monotone" dataKey="actual" stroke="#d4af37" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
            <div className="guardrail-legend">
                <span><span className="guardrail-dot" style={{ background: '#d4af37' }} /> Actual Withdrawal</span>
                <span><span className="guardrail-dot" style={{ background: '#34D399' }} /> Upper Guardrail (ceiling)</span>
                <span><span className="guardrail-dot" style={{ background: '#F87171' }} /> Lower Guardrail (floor)</span>
            </div>
        </motion.div>
    );
};

export default GuardrailChart;
