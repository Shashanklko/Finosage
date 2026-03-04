import React from 'react';
import { motion } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="engine-chart-tooltip">
                <p className="tip-gold">Return: {payload[0]?.payload.ret}%</p>
                <p className="tip-label">Risk (σ): {payload[0]?.payload.risk}%</p>
            </div>
        );
    }
    return null;
};

const EfficientFrontierChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    const frontierData = data.filter(d => !d.isCurrent && !d.isOptimal);
    const currentPortfolio = data.filter(d => d.isCurrent);
    const optimalPortfolio = data.filter(d => d.isOptimal);

    return (
        <motion.div
            className="engine-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
        >
            <h3 className="engine-chart-title">Efficient Frontier</h3>
            <ResponsiveContainer width="100%" height={280}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" strokeOpacity={0.5} />
                    <XAxis
                        dataKey="risk" name="Risk" unit="%"
                        tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#1F2937' }} tickLine={false}
                        label={{ value: 'Risk (σ %)', position: 'bottom', fill: '#4B5563', fontSize: 10, offset: -5 }}
                    />
                    <YAxis
                        dataKey="ret" name="Return" unit="%"
                        tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false}
                        label={{ value: 'Return %', angle: -90, position: 'insideLeft', fill: '#4B5563', fontSize: 10 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter data={frontierData} fill="#374151" r={3} />
                    {optimalPortfolio.length > 0 && <Scatter data={optimalPortfolio} fill="#3B82F6" r={6} shape="diamond" />}
                    {currentPortfolio.length > 0 && <Scatter data={currentPortfolio} fill="#d4af37" r={7} />}
                </ScatterChart>
            </ResponsiveContainer>
            <div className="mc-paths-legend">
                <span><span className="mc-legend-dot" style={{ background: '#d4af37' }} /> Your Portfolio</span>
                <span><span className="mc-legend-dot" style={{ background: '#3B82F6' }} /> Optimal (Max Sharpe)</span>
                <span><span className="mc-legend-dot" style={{ background: '#374151' }} /> Frontier</span>
            </div>
        </motion.div>
    );
};

export default EfficientFrontierChart;
