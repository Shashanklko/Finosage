import React, { useState } from 'react';
import { motion } from 'framer-motion';

const defaultGoals = [
    { id: 1, name: 'Dream Home', amount: 8000000, years: 8, priority: 'High', inflation: 6 },
    { id: 2, name: "Child's Education", amount: 3000000, years: 12, priority: 'High', inflation: 10 },
    { id: 3, name: 'International Vacation', amount: 500000, years: 3, priority: 'Low', inflation: 8 },
    { id: 4, name: 'Emergency Fund', amount: 1000000, years: 2, priority: 'Medium', inflation: 5 },
];

let nextId = 5;

const GoalInputForm = ({ onGenerate, onBack }) => {
    const [goals, setGoals] = useState(defaultGoals);
    const [monthlySavings, setMonthlySavings] = useState(80000);
    const [stepUpPercent, setStepUpPercent] = useState(5);
    const [existingCorpus, setExistingCorpus] = useState(1500000);
    const [riskProfile, setRiskProfile] = useState('Moderate');

    const riskLevels = ['Conservative', 'Moderate', 'Aggressive'];

    const updateGoal = (id, field, value) => {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g));
    };

    const addGoal = () => {
        setGoals(prev => [...prev, { id: nextId++, name: '', amount: 0, years: 5, priority: 'Medium', inflation: 6 }]);
    };

    const removeGoal = (id) => {
        setGoals(prev => prev.filter(g => g.id !== id));
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
                    <p className="engine-page-subtitle">Define your financial milestones</p>
                </motion.div>

                {/* Goal List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="goal-list">
                        {goals.map(goal => (
                            <div key={goal.id} className="goal-row">
                                <div>
                                    <div className="goal-col-label">Goal Name</div>
                                    <input
                                        type="text"
                                        value={goal.name}
                                        onChange={e => updateGoal(goal.id, 'name', e.target.value)}
                                        placeholder="e.g. Dream Home"
                                    />
                                </div>
                                <div>
                                    <div className="goal-col-label">Target Amount</div>
                                    <input
                                        type="number"
                                        value={goal.amount}
                                        onChange={e => updateGoal(goal.id, 'amount', Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <div className="goal-col-label">Timeline</div>
                                    <input
                                        type="number"
                                        value={goal.years}
                                        onChange={e => updateGoal(goal.id, 'years', Number(e.target.value))}
                                        style={{ width: '3rem' }}
                                    />
                                    <span style={{ fontSize: '0.55rem', color: '#4B5563', marginLeft: '0.3rem' }}>yrs</span>
                                </div>
                                <div>
                                    <div className="goal-col-label">Inflation (%)</div>
                                    <input
                                        type="number"
                                        value={goal.inflation}
                                        onChange={e => updateGoal(goal.id, 'inflation', Number(e.target.value))}
                                        style={{ width: '3rem' }}
                                    />
                                </div>
                                <div>
                                    <div className="goal-col-label">Priority</div>
                                    <select
                                        value={goal.priority}
                                        onChange={e => updateGoal(goal.id, 'priority', e.target.value)}
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <button className="goal-remove-btn" onClick={() => removeGoal(goal.id)}>×</button>
                            </div>
                        ))}
                    </div>
                    <button className="goal-add-btn" onClick={addGoal}>+ Add Goal</button>
                </motion.div>

                {/* Parameters */}
                <motion.div
                    className="param-row"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div className="engine-field">
                        <label>Monthly Savings</label>
                        <div className="engine-input-wrap">
                            <input type="number" value={monthlySavings} onChange={e => setMonthlySavings(Number(e.target.value))} />
                            <span className="engine-input-unit">₹</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => setMonthlySavings(v => v + 5000)}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => setMonthlySavings(v => Math.max(0, v - 5000))}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>Yearly Savings Increase</label>
                        <div className="engine-input-wrap">
                            <input type="number" value={stepUpPercent} onChange={e => setStepUpPercent(Number(e.target.value))} />
                            <span className="engine-input-unit">%</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => setStepUpPercent(v => Math.min(100, v + 1))}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => setStepUpPercent(v => Math.max(0, v - 1))}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>Current Savings</label>
                        <div className="engine-input-wrap">
                            <input type="number" value={existingCorpus} onChange={e => setExistingCorpus(Number(e.target.value))} />
                            <span className="engine-input-unit">₹</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => setExistingCorpus(v => v + 100000)}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => setExistingCorpus(v => Math.max(0, v - 100000))}>▼</button>
                            </div>
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
                                className={`risk-option ${riskProfile === level ? 'active' : ''}`}
                                onClick={() => setRiskProfile(level)}
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
                    transition={{ duration: 0.8, delay: 0.55 }}
                >
                    <button
                        className="engine-generate-btn"
                        disabled={goals.length === 0}
                        style={goals.length === 0 ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                        onClick={() => onGenerate({ goals, monthlySavings, stepUpPercent, existingCorpus, riskProfile })}
                    >
                        Optimize Goals
                    </button>
                    <p className="engine-generate-note">Smart Goal Simulation · Priority-weighted allocation</p>
                </motion.div>
            </div>
        </div>
    );
};

export default GoalInputForm;
