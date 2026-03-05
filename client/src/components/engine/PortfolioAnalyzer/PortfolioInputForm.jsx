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
        Object.fromEntries(assets.map(a => [a.id, '']))
    );
    const [amount, setAmount] = useState('');
    const [horizon, setHorizon] = useState('');
    const [risk, setRisk] = useState('Moderate');
    const [error, setError] = useState('');
    const [touched, setTouched] = useState({});

    const totalWeight = Object.values(weights).reduce((s, v) => s + (Number(v) || 0), 0);

    const handleWeightChange = (id, val) => {
        setWeights(prev => ({ ...prev, [id]: val }));
    };

    const handleBlur = (fieldId) => {
        setTouched(prev => ({ ...prev, [fieldId]: true }));
    };

    const getFieldError = (fieldId) => {
        if (fieldId === 'amount') {
            if (amount !== '' && Number(amount) <= 0) return 'Invalid amount';
        }
        if (fieldId === 'horizon') {
            if (horizon !== '' && (Number(horizon) <= 0 || Number(horizon) > 50)) return 'Horizon 1-50 years';
        }
        if (fieldId.startsWith('weight-')) {
            const assetId = fieldId.replace('weight-', '');
            const val = weights[assetId];
            if (val !== '' && (Number(val) < 0 || Number(val) > 100)) return 'Weight 0-100%';
        }
        return null;
    };

    const validate = () => {
        if (amount === '' || horizon === '') {
            setError('');
            return false;
        }

        const paramError = getFieldError('amount') || getFieldError('horizon');
        if (paramError) {
            setError(paramError);
            return false;
        }

        for (const asset of assets) {
            const wErr = getFieldError(`weight-${asset.id}`);
            if (wErr) {
                setError(wErr);
                return false;
            }
        }

        if (totalWeight !== 100 && totalWeight !== 0) {
            setError('Total portfolio allocation must equal exactly 100%.');
            return false;
        }

        setError('');
        return true;
    };

    React.useEffect(() => {
        validate();
    }, [weights, amount, horizon]);

    const isFormValid = () => {
        return totalWeight === 100 && amount !== '' && horizon !== '' && !error;
    };

    const validateAndSubmit = () => {
        if (isFormValid()) {
            onGenerate({
                weights: Object.fromEntries(Object.entries(weights).map(([k, v]) => [k, Number(v || 0)])),
                amount: Number(amount),
                horizon: Number(horizon),
                risk
            });
        }
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
                            <div key={asset.id} className={`alloc-field ${touched[`weight-${asset.id}`] && getFieldError(`weight-${asset.id}`) ? 'has-error' : ''}`}>
                                <div className="alloc-color" style={{ background: asset.color }} />
                                <span className="alloc-name">{asset.name}</span>
                                <div className="alloc-input-wrap">
                                    <input
                                        type="number"
                                        className="alloc-input"
                                        value={weights[asset.id]}
                                        onChange={(e) => handleWeightChange(asset.id, e.target.value)}
                                        onBlur={() => handleBlur(`weight-${asset.id}`)}
                                        min={0}
                                        max={100}
                                    />
                                    <span className="alloc-percent">%</span>
                                    <div className="alloc-stepper">
                                        <button className="alloc-stepper-btn" onClick={() => { handleWeightChange(asset.id, Math.min(100, Number(weights[asset.id] || 0) + 1)); handleBlur(`weight-${asset.id}`); }}>▲</button>
                                        <button className="alloc-stepper-btn" onClick={() => { handleWeightChange(asset.id, Math.max(0, Number(weights[asset.id] || 0) - 1)); handleBlur(`weight-${asset.id}`); }}>▼</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className={`alloc-total ${totalWeight !== 100 && totalWeight !== 0 ? 'over' : ''}`}>
                        Total: <span>{totalWeight}%</span> {totalWeight !== 100 && totalWeight !== 0 && '(must equal 100%)'}
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
                        <div className={`engine-input-wrap ${touched['amount'] && getFieldError('amount') ? 'has-error' : ''}`}>
                            <input type="number" value={amount} onChange={e => { setAmount(e.target.value); setError(''); }} onBlur={() => handleBlur('amount')} />
                            <span className="engine-input-unit">₹</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => { setAmount(a => Number(a || 0) + 100000); handleBlur('amount'); }}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => { setAmount(a => Math.max(0, Number(a || 0) - 100000)); handleBlur('amount'); }}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>Time Horizon</label>
                        <div className={`engine-input-wrap ${touched['horizon'] && getFieldError('horizon') ? 'has-error' : ''}`}>
                            <input type="number" value={horizon} onChange={e => { setHorizon(e.target.value); setError(''); }} onBlur={() => handleBlur('horizon')} />
                            <span className="engine-input-unit">years</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => { setHorizon(h => Number(h || 0) + 1); handleBlur('horizon'); }}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => { setHorizon(h => Math.max(1, Number(h || 0) - 1)); handleBlur('horizon'); }}>▼</button>
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
                                onClick={() => { setRisk(level); setError(''); }}
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
                    {error && <p className="auth-error" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{error}</p>}
                    <button
                        className="engine-generate-btn"
                        onClick={validateAndSubmit}
                        disabled={!isFormValid()}
                        style={!isFormValid() ? { opacity: 0.5, cursor: 'not-allowed', filter: 'grayscale(1)' } : {}}
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
