import React, { useState } from 'react';
import { motion } from 'framer-motion';

const strategies = [
    { id: 'guardrail', label: 'Adjustable Spending', desc: 'Changes spending based on how your savings perform' },
    { id: 'fixed', label: 'Stable Spending', desc: 'Constant spending that keeps up with rising costs' },
    { id: 'percent', label: 'Percentage Spending', desc: 'Spend a fixed percentage of your remaining savings each year' },
    { id: 'bucket', label: 'Bucket Strategy', desc: 'Separates savings into short, medium, and long-term buckets' },
];

const scenarios = [
    { id: 'baseline', label: 'Normal Markets' },
    { id: 'inflation', label: 'High Cost of Living (+3% extra)' },
    { id: 'crash', label: 'Early Market Crash (-40% in Year 2)' },
    { id: 'stagflation', label: 'Stagflation (Poor Economy)' },
    { id: 'longevity', label: 'Living Longer (+10 extra years)' },
    { id: 'sequence', label: 'Poor Initial Market Timing (First 5 years)' },
];

const WithdrawalInputForm = ({ onGenerate, onBack }) => {
    const [corpus, setCorpus] = useState('');
    const [annualWithdrawal, setAnnualWithdrawal] = useState('');
    const [retirementAge, setRetirementAge] = useState('');
    const [horizon, setHorizon] = useState('');
    const [inflationRate, setInflationRate] = useState('');
    const [selectedStrategy, setSelectedStrategy] = useState('guardrail');
    const [taxRate, setTaxRate] = useState('');
    const [selectedScenarios, setSelectedScenarios] = useState(['baseline', 'crash', 'inflation']);
    const [error, setError] = useState('');
    const [touched, setTouched] = useState({});

    const handleBlur = (fieldId) => {
        setTouched(prev => ({ ...prev, [fieldId]: true }));
    };

    const getFieldError = (fieldId) => {
        switch (fieldId) {
            case 'corpus':
                if (corpus !== '' && Number(corpus) <= 0) return 'Invalid savings';
                break;
            case 'annualWithdrawal':
                if (annualWithdrawal !== '' && Number(annualWithdrawal) <= 0) return 'Invalid withdrawal';
                break;
            case 'retirementAge':
                if (retirementAge !== '' && (Number(retirementAge) < 15 || Number(retirementAge) > 100)) return 'Age 15-100';
                break;
            case 'horizon':
                if (horizon !== '' && Number(horizon) <= 0) return 'Invalid horizon';
                break;
            default:
                return null;
        }
        return null;
    };

    const validate = () => {
        if (corpus === '' || annualWithdrawal === '' || retirementAge === '' || horizon === '') {
            setError('');
            return false;
        }

        const fieldError = getFieldError('corpus') || getFieldError('annualWithdrawal') ||
            getFieldError('retirementAge') || getFieldError('horizon');
        if (fieldError) {
            setError(fieldError);
            return false;
        }

        setError('');
        return true;
    };

    React.useEffect(() => {
        validate();
    }, [corpus, annualWithdrawal, retirementAge, horizon, inflationRate, taxRate, selectedStrategy, selectedScenarios]);

    const isFormValid = () => {
        return corpus !== '' && annualWithdrawal !== '' && retirementAge !== '' &&
            horizon !== '' && !error;
    };

    const validateAndSubmit = () => {
        if (isFormValid()) {
            onGenerate({
                corpus: Number(corpus),
                annualWithdrawal: Number(annualWithdrawal),
                retirementAge: Number(retirementAge),
                horizon: Number(horizon),
                inflationRate: Number(inflationRate || 6),
                taxRate: Number(taxRate || 0),
                strategy: selectedStrategy,
                scenarios: selectedScenarios
            });
        }
    };

    const toggleScenario = (id) => {
        setSelectedScenarios(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
        setError('');
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
                    <p className="engine-page-subtitle">Configure withdrawal parameters & stress scenarios</p>
                </motion.div>

                {/* Parameters */}
                <motion.div
                    className="engine-form-grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="engine-field">
                        <label>Retirement Savings</label>
                        <div className={`engine-input-wrap ${touched['corpus'] && getFieldError('corpus') ? 'has-error' : ''}`}>
                            <input type="number" value={corpus} onChange={e => setCorpus(e.target.value)} onBlur={() => handleBlur('corpus')} />
                            <span className="engine-input-unit">₹</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => { setCorpus(v => Number(v || 0) + 1000000); handleBlur('corpus'); }}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => { setCorpus(v => Math.max(0, Number(v || 0) - 1000000)); handleBlur('corpus'); }}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>Annual Withdrawal</label>
                        <div className={`engine-input-wrap ${touched['annualWithdrawal'] && getFieldError('annualWithdrawal') ? 'has-error' : ''}`}>
                            <input type="number" value={annualWithdrawal} onChange={e => setAnnualWithdrawal(e.target.value)} onBlur={() => handleBlur('annualWithdrawal')} />
                            <span className="engine-input-unit">₹</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => { setAnnualWithdrawal(v => Number(v || 0) + 100000); handleBlur('annualWithdrawal'); }}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => { setAnnualWithdrawal(v => Math.max(0, Number(v || 0) - 100000)); handleBlur('annualWithdrawal'); }}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>Retirement Age</label>
                        <div className={`engine-input-wrap ${touched['retirementAge'] && getFieldError('retirementAge') ? 'has-error' : ''}`}>
                            <input type="number" value={retirementAge} onChange={e => setRetirementAge(e.target.value)} onBlur={() => handleBlur('retirementAge')} />
                            <span className="engine-input-unit">yrs</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => { setRetirementAge(v => Number(v || 0) + 1); handleBlur('retirementAge'); }}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => { setRetirementAge(v => Math.max(15, Number(v || 0) - 1)); handleBlur('retirementAge'); }}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>How many years to plan for</label>
                        <div className={`engine-input-wrap ${touched['horizon'] && getFieldError('horizon') ? 'has-error' : ''}`}>
                            <input type="number" value={horizon} onChange={e => setHorizon(e.target.value)} onBlur={() => handleBlur('horizon')} />
                            <span className="engine-input-unit">yrs</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => { setHorizon(v => Number(v || 0) + 1); handleBlur('horizon'); }}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => { setHorizon(v => Math.max(5, Number(v || 0) - 1)); handleBlur('horizon'); }}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>Rising Cost of Living</label>
                        <div className="engine-input-wrap">
                            <input type="number" value={inflationRate} onChange={e => setInflationRate(e.target.value)} />
                            <span className="engine-input-unit">%</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => setInflationRate(v => Number(v || 0) + 1)}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => setInflationRate(v => Math.max(0, Number(v || 0) - 1))}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>Estimated Tax Rate</label>
                        <div className="engine-input-wrap">
                            <input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} />
                            <span className="engine-input-unit">%</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => setTaxRate(v => Number(v || 0) + 1)}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => setTaxRate(v => Math.max(0, Number(v || 0) - 1))}>▼</button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Strategy Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.35 }}
                >
                    <span className="engine-strategy-label">Spending Strategy</span>
                    <div className="engine-strategy-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
                        {strategies.map(s => (
                            <button
                                key={s.id}
                                className={`engine-strategy-btn ${selectedStrategy === s.id ? 'active' : ''}`}
                                onClick={() => setSelectedStrategy(s.id)}
                            >
                                <div className="strategy-name">{s.label}</div>
                                <div className="strategy-desc">{s.desc}</div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Stress Scenarios */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.45 }}
                >
                    <span className="engine-strategy-label">Stress Scenarios (select multiple)</span>
                    <div className="scenario-grid">
                        {scenarios.map(s => (
                            <div
                                key={s.id}
                                className={`scenario-chip ${selectedScenarios.includes(s.id) ? 'active' : ''}`}
                                onClick={() => toggleScenario(s.id)}
                            >
                                <span className="scenario-check">✓</span>
                                <span className="scenario-chip-text">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Generate */}
                <motion.div
                    className="engine-generate-wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.55 }}
                >
                    {error && <p className="auth-error" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{error}</p>}
                    <button
                        className="engine-generate-btn"
                        onClick={validateAndSubmit}
                        disabled={!isFormValid()}
                        style={!isFormValid() ? { opacity: 0.5, cursor: 'not-allowed', filter: 'grayscale(1)' } : {}}
                    >
                        Run Stress Test
                    </button>
                    <p className="engine-generate-note">Smart Planning Simulation · Multi-scenario stress testing</p>
                </motion.div>
            </div>
        </div>
    );
};

export default WithdrawalInputForm;
