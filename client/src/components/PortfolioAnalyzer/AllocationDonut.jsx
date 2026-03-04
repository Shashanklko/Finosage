import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AllocationDonut = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <motion.div
            className="engine-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            <h3 className="engine-chart-title">Asset Allocation</h3>
            <div className="donut-wrap">
                <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%" cy="50%"
                            innerRadius={55} outerRadius={85}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {data.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="donut-legend">
                    {data.map((item, i) => (
                        <div key={i} className="donut-legend-item">
                            <div className="donut-legend-color" style={{ background: item.color }} />
                            <span>{item.name}</span>
                            <span style={{ color: '#fff', marginLeft: 'auto', fontWeight: 400 }}>{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AllocationDonut;
