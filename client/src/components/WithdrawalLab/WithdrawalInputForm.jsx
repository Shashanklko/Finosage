import React, { useState } from 'react';
import { motion } from 'framer-motion';

const strategies = [
    { id: 'guardrail', label: 'Dynamic Guardrail', desc: 'Adjusts withdrawals based on portfolio thresholds' },
    { id: 'fixed', label: 'Fixed Real', desc: 'Inflation-adjusted constant withdrawals' },
    { id: 'percent', label: 'Percentage', desc: 'Fixed % of remaining portfolio each year' },
    { id: 'bucket', label: 'Bucket Strategy', desc: 'Short/medium/long term allocation buckets' },
];

const scenarios = [
    { id: 'baseline', label: 'Baseline (Normal Markets)' },
    { id: 'inflation', label: 'High Inflation (+3% above expected)' },
    { id: 'crash', label: 'Early Market Crash (-40% in Year 2)' },
    { id: 'stagflation', label: 'Stagflation (Low growth + High inflation)' },
    { id: 'longevity', label: 'Extended Longevity (+10 years)' },
    { id: 'sequence', label: 'Poor Sequence of Returns (First 5 years)' },
];

const WithdrawalInputForm = ({ onGenerate, onBack }) => {
    const [corpus, setCorpus] = useState(30000000);
    const [annualWithdrawal, setAnnualWithdrawal] = useState(1200000);
    const [retirementAge, setRetirementAge] = useState(60);
    const [horizon, setHorizon] = useState(30);
    const [inflationRate, setInflationRate] = useState(6);
    const [selectedStrategy, setSelectedStrategy] = useState('guardrail');
    const [selectedScenarios, setSelectedScenarios] = useState(['baseline', 'crash', 'inflation']);

    const toggleScenario = (id) => {
        setSelectedScenarios(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
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
                        <label>Retirement Corpus</label>
                        <div className="engine-input-wrap">
                            <input type="number" value={corpus} onChange={e => setCorpus(Number(e.target.value))} />
                            <span className="engine-input-unit">₹</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => setCorpus(v => v + 1000000)}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => setCorpus(v => Math.max(0, v - 1000000))}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>Annual Withdrawal</label>
                        <div className="engine-input-wrap">
                            <input type="number" value={annualWithdrawal} onChange={e => setAnnualWithdrawal(Number(e.target.value))} />
                            <span className="engine-input-unit">₹</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => setAnnualWithdrawal(v => v + 100000)}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => setAnnualWithdrawal(v => Math.max(0, v - 100000))}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>Retirement Age</label>
                        <div className="engine-input-wrap">
                            <input type="number" value={retirementAge} onChange={e => setRetirementAge(Number(e.target.value))} />
                            <span className="engine-input-unit">yrs</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => setRetirementAge(v => v + 1)}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => setRetirementAge(v => Math.max(40, v - 1))}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>Planning Horizon</label>
                        <div className="engine-input-wrap">
                            <input type="number" value={horizon} onChange={e => setHorizon(Number(e.target.value))} />
                            <span className="engine-input-unit">yrs</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => setHorizon(v => v + 1)}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => setHorizon(v => Math.max(5, v - 1))}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>Inflation Rate</label>
                        <div className="engine-input-wrap">
                            <input type="number" value={inflationRate} onChange={e => setInflationRate(Number(e.target.value))} />
                            <span className="engine-input-unit">%</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => setInflationRate(v => v + 1)}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => setInflationRate(v => Math.max(0, v - 1))}>▼</button>
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
                    <span className="engine-strategy-label">Withdrawal Strategy</span>
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
                    <button
                        className="engine-generate-btn"
                        onClick={() => onGenerate({ corpus, annualWithdrawal, retirementAge, horizon, inflationRate, strategy: selectedStrategy, scenarios: selectedScenarios })}
                    >
                        Run Stress Test
                    </button>
                    <p className="engine-generate-note">Dynamic Programming · Quasi-Monte Carlo · Multi-scenario stress testing</p>
                </motion.div>
            </div>
        </div>
    );
};

export default WithdrawalInputForm;
