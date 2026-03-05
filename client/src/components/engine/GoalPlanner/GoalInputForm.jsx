import React, { useState } from 'react';
import { motion } from 'framer-motion';

const defaultGoals = [];

let nextId = 1;

const GoalInputForm = ({ onGenerate, onBack }) => {
    const [goals, setGoals] = useState(defaultGoals);
    const [monthlySavings, setMonthlySavings] = useState('');
    const [stepUpPercent, setStepUpPercent] = useState('');
    const [existingCorpus, setExistingCorpus] = useState('');
    const [riskProfile, setRiskProfile] = useState('Moderate');
    const [error, setError] = useState('');

    const riskLevels = ['Conservative', 'Moderate', 'Aggressive'];

    const updateGoal = (id, field, value) => {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g));
        if (error) setError('');
    };

    const addGoal = () => {
        setGoals(prev => [...prev, { id: nextId++, name: '', amount: '', years: '', priority: 'Medium', inflation: '' }]);
        if (error) setError('');
    };

    const removeGoal = (id) => {
        setGoals(prev => prev.filter(g => g.id !== id));
        if (error) setError('');
    };

    const [touched, setTouched] = useState({});

    const handleBlur = (fieldId) => {
        setTouched(prev => ({ ...prev, [fieldId]: true }));
    };

    const getFieldError = (fieldId) => {
        if (fieldId === 'monthlySavings') {
            if (monthlySavings !== '' && Number(monthlySavings) < 0) return 'Invalid amount';
        }

        // For individual goals
        if (fieldId.startsWith('goal-')) {
            const [, id, type] = fieldId.split('-');
            const goal = goals.find(g => g.id === Number(id));
            if (!goal) return null;
            if (type === 'amount' && goal.amount !== '' && Number(goal.amount) <= 0) return 'Invalid amount';
        }

        return null;
    };

    const validate = () => {
        if (goals.length === 0) {
            setError('');
            return false;
        }

        for (const goal of goals) {
            const amountError = getFieldError(`goal-${goal.id}-amount`);
            if (amountError) {
                setError(amountError);
                return false;
            }
        }

        const savingsError = getFieldError('monthlySavings');
        if (savingsError) {
            setError(savingsError);
            return false;
        }

        setError('');
        return true;
    };

    React.useEffect(() => {
        validate();
    }, [goals, monthlySavings, stepUpPercent, existingCorpus]);

    const isFormValid = () => {
        const hasGoals = goals.length > 0;
        const allGoalsComplete = goals.every(g => g.name && g.amount !== '' && g.years !== '');
        return hasGoals && allGoalsComplete && monthlySavings !== '' && !error;
    };

    const validateAndSubmit = () => {
        if (isFormValid()) {
            onGenerate({
                goals: goals.map(g => ({ ...g, amount: Number(g.amount), years: Number(g.years), inflation: Number(g.inflation || 6) })),
                monthlySavings: Number(monthlySavings),
                stepUpPercent: Number(stepUpPercent || 0),
                existingCorpus: Number(existingCorpus || 0),
                riskProfile
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
                        <div key={goal.id} className={`goal-row ${touched[`goal-${goal.id}-amount`] && getFieldError(`goal-${goal.id}-amount`) ? 'has-error' : ''}`}>
                                <div>
                                    <div className="goal-col-label">Goal Name</div>
                                    <input
                                        type="text"
                                        value={goal.name}
                                        onChange={e => updateGoal(goal.id, 'name', e.target.value)}
                                        onBlur={() => handleBlur(`goal-${goal.id}-name`)}
                                        placeholder="e.g. Retirement"
                                    />
                                </div>
                                <div>
                                    <div className="goal-col-label">Target Amount</div>
                                    <input
                                        type="number"
                                        value={goal.amount}
                                        onChange={e => updateGoal(goal.id, 'amount', e.target.value)}
                                        onBlur={() => handleBlur(`goal-${goal.id}-amount`)}
                                    />
                                </div>
                                <div>
                                    <div className="goal-col-label">Timeline</div>
                                    <input
                                        type="number"
                                        value={goal.years}
                                        onChange={e => updateGoal(goal.id, 'years', e.target.value)}
                                        onBlur={() => handleBlur(`goal-${goal.id}-years`)}
                                        style={{ width: '3rem' }}
                                    />
                                    <span style={{ fontSize: '0.55rem', color: '#4B5563', marginLeft: '0.3rem' }}>yrs</span>
                                </div>
                                <div>
                                    <div className="goal-col-label">Inflation (%)</div>
                                    <input
                                        type="number"
                                        value={goal.inflation}
                                        onChange={e => updateGoal(goal.id, 'inflation', e.target.value)}
                                        onBlur={() => handleBlur(`goal-${goal.id}-inflation`)}
                                        placeholder="6"
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
                        <div className={`engine-input-wrap ${touched['monthlySavings'] && getFieldError('monthlySavings') ? 'has-error' : ''}`}>
                            <input type="number" value={monthlySavings} onChange={e => setMonthlySavings(e.target.value)} onBlur={() => handleBlur('monthlySavings')} />
                            <span className="engine-input-unit">₹</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => { setMonthlySavings(v => Number(v || 0) + 5000); handleBlur('monthlySavings'); }}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => { setMonthlySavings(v => Math.max(0, Number(v || 0) - 5000)); handleBlur('monthlySavings'); }}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>Yearly Savings Increase</label>
                        <div className="engine-input-wrap">
                            <input type="number" value={stepUpPercent} onChange={e => setStepUpPercent(e.target.value)} onBlur={() => handleBlur('stepUpPercent')} />
                            <span className="engine-input-unit">%</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => { setStepUpPercent(v => Math.min(100, Number(v || 0) + 1)); handleBlur('stepUpPercent'); }}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => { setStepUpPercent(v => Math.max(0, Number(v || 0) - 1)); handleBlur('stepUpPercent'); }}>▼</button>
                            </div>
                        </div>
                    </div>
                    <div className="engine-field">
                        <label>Current Savings</label>
                        <div className="engine-input-wrap">
                            <input type="number" value={existingCorpus} onChange={e => setExistingCorpus(e.target.value)} onBlur={() => handleBlur('existingCorpus')} />
                            <span className="engine-input-unit">₹</span>
                            <div className="engine-stepper">
                                <button className="engine-stepper-btn" onClick={() => { setExistingCorpus(v => Number(v || 0) + 1000000); handleBlur('existingCorpus'); }}>▲</button>
                                <button className="engine-stepper-btn" onClick={() => { setExistingCorpus(v => Math.max(0, Number(v || 0) - 1000000)); handleBlur('existingCorpus'); }}>▼</button>
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
                    {error && <p className="auth-error" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{error}</p>}
                    <button
                        className="engine-generate-btn"
                        onClick={validateAndSubmit}
                        disabled={!isFormValid()}
                        style={!isFormValid() ? { opacity: 0.5, cursor: 'not-allowed', filter: 'grayscale(1)' } : {}}
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
