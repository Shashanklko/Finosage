import React, { useState } from 'react';
import { motion } from 'framer-motion';

const assets = [
    { id: 'largeCap', name: 'Large Cap Equity', color: '#d4af37', defaultWeight: 35 },
    { id: 'midSmall', name: 'Mid/Small Equity', color: '#3B82F6', defaultWeight: 15 },
    { id: 'intl', name: 'Global Markets', color: '#8B5CF6', defaultWeight: 10 },
    { id: 'debt', name: 'Bonds & Debt', color: '#10B981', defaultWeight: 20 },
    { id: 'gold', name: 'Gold', color: '#F59E0B', defaultWeight: 5 },
    { id: 'commodities', name: 'Commodities', color: '#D97706', defaultWeight: 5 },
    { id: 'reits', name: 'Real Estate (REITs)', color: '#EC4899', defaultWeight: 5 },
    { id: 'liquid', name: 'Cash / Liquid Funds', color: '#14B8A6', defaultWeight: 5 },
];

const riskLevels = ['Conservative', 'Moderate', 'Aggressive'];

const PortfolioInputForm = ({ onGenerate, onBack }) => {
    const [weights, setWeights] = useState(
        Object.fromEntries(assets.map(a => [a.id, a.defaultWeight]))
    );
    const [amount, setAmount] = useState(5000000);
    const [horizon, setHorizon] = useState(10);
    const [risk, setRisk] = useState('Moderate');

    const totalWeight = Object.values(weights).reduce((s, v) => s + v, 0);

    const handleWeightChange = (id, val) => {
        setWeights(prev => ({ ...prev, [id]: Number(val) || 0 }));
    };

    return (
        <div className="engine-page">


            <div className="engine-page-scrollable">
                <motion.div
                    className="engine-page-header"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="engine-page-subtitle">Define your asset allocation</p>
                </motion.div>

                {/* Allocation Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="alloc-grid">
                        {assets.map(asset => (
                            <div key={asset.id} className="alloc-field">
                                <div className="alloc-color" style={{ background: asset.color }} />
                                <span className="alloc-name">{asset.name}</span>
                                <div className="alloc-input-wrap">
                                    <input
                                        type="number"
                                        className="alloc-input"
                                        value={weights[asset.id]}
                                        onChange={(e) => handleWeightChange(asset.id, e.target.value)}
                                        min={0}
                                        max={100}
                                    />
                                    <span className="alloc-percent">%</span>
                                    <div className="alloc-stepper">
                                        <button className="alloc-stepper-btn" onClick={() => handleWeightChange(asset.id, Math.min(100, weights[asset.id] + 1))}>▲</button>
                                        <button className="alloc-stepper-btn" onClick={() => handleWeightChange(asset.id, Math.max(0, weights[asset.id] - 1))}>▼</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className={`alloc-total ${totalWeight !== 100 ? 'over' : ''}`}>
                        Total: <span>{totalWeight}%</span> {totalWeight !== 100 && '(must equal 100%)'}
                    </p>
                </motion.div>

                {/* Parameters */}
                <motion.div
                    className="param-row"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.35 }}
                >
                    <div className="engine-field">
                        <label>Investment Amount</label>
                        <div className="engine-input-wrap">
                            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
                            <span className="engine-input-unit">₹</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => setAmount(a => a + 100000)}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => setAmount(a => Math.max(0, a - 100000))}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>Time Horizon</label>
                        <div className="engine-input-wrap">
                            <input type="number" value={horizon} onChange={e => setHorizon(Number(e.target.value))} />
                            <span className="engine-input-unit">years</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => setHorizon(h => h + 1)}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => setHorizon(h => Math.max(1, h - 1))}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>Simulation Detail</label>
                        <div className="engine-input-wrap">
                            <input type="number" value={10000} readOnly style={{ color: '#6B7280' }} />
                            <span className="engine-input-unit">Scenarios</span>
                        </div>
                    </div>
                </motion.div>

                {/* Risk Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <span className="engine-strategy-label">Risk Tolerance</span>
                    <div className="risk-toggle">
                        {riskLevels.map(level => (
                            <button
                                key={level}
                                className={`risk-option ${risk === level ? 'active' : ''}`}
                                onClick={() => setRisk(level)}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Generate */}
                <motion.div
                    className="engine-generate-wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <button
                        className="engine-generate-btn"
                        disabled={totalWeight !== 100}
                        style={totalWeight !== 100 ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                        onClick={() => onGenerate({ weights, amount, horizon, risk })}
                    >
                        Analyze Portfolio
                    </button>
                    <p className="engine-generate-note">Real-world Crash Simulation · Student-t Fat Tails · Dynamic Growth factors</p>
                </motion.div>
            </div>
        </div>
    );
};

export default PortfolioInputForm;
