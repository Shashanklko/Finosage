import React from 'react';
import { motion } from 'framer-motion';

const fields = [
    { id: 'currentAge', label: 'Current Age', placeholder: '35', unit: 'years' },
    { id: 'retirementAge', label: 'Retirement Age', placeholder: '60', unit: 'years' },
    { id: 'lifeExpectancy', label: 'Life Expectancy', placeholder: '90', unit: 'years' },
    { id: 'portfolioValue', label: 'Current Savings', placeholder: '5000000', unit: '₹' },
    { id: 'monthlyContribution', label: 'Monthly Savings', placeholder: '50000', unit: '₹' },
    { id: 'expectedReturn', label: 'Expected Growth', placeholder: '11', unit: '%' },
    { id: 'volatility', label: 'Market Risk (Ups & Downs)', placeholder: '14', unit: '%' },
    { id: 'inflationRate', label: 'Rising Cost of Living', placeholder: '6', unit: '%' },
    { id: 'annualWithdrawal', label: 'Yearly Spending', placeholder: '600000', unit: '₹' },
];

const strategies = [
    { id: 'guardrail', label: 'Guardrail', desc: 'Dynamic adjustment based on portfolio thresholds' },
    { id: 'fixed', label: 'Fixed', desc: 'Constant inflation-adjusted withdrawals' },
    { id: 'percentage', label: 'Percentage', desc: 'Fixed percentage of remaining portfolio' },
];

const RetirementInputForm = ({ onGenerate, onBack }) => {
    const [formData, setFormData] = React.useState({
        currentAge: 35, retirementAge: 60, lifeExpectancy: 90,
        portfolioValue: 5000000, monthlyContribution: 50000,
        expectedReturn: 11, volatility: 14, inflationRate: 6,
        annualWithdrawal: 600000, strategy: 'guardrail'
    });

    const handleChange = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }));
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
                    <p className="engine-page-subtitle">Configure your simulation parameters</p>
                </motion.div>

                <motion.div
                    className="engine-form-grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {fields.map((field) => (
                        <div key={field.id} className="engine-field">
                            <label>{field.label}</label>
                            <div className="engine-input-wrap">
                                <input
                                    type="number"
                                    value={formData[field.id]}
                                    onChange={(e) => handleChange(field.id, Number(e.target.value))}
                                    placeholder={field.placeholder}
                                />
                                <span className="engine-input-unit">{field.unit}</span>
                                <div className="engine-stepper">
                                    <button className="engine-stepper-btn" onClick={() => handleChange(field.id, formData[field.id] + 1)}>▲</button>
                                    <button className="engine-stepper-btn" onClick={() => handleChange(field.id, formData[field.id] - 1)}>▼</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <span className="engine-strategy-label">Withdrawal Strategy</span>
                    <div className="engine-strategy-grid">
                        {strategies.map((s) => (
                            <button
                                key={s.id}
                                className={`engine-strategy-btn ${formData.strategy === s.id ? 'active' : ''}`}
                                onClick={() => handleChange('strategy', s.id)}
                            >
                                <div className="strategy-name">{s.label}</div>
                                <div className="strategy-desc">{s.desc}</div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    className="engine-generate-wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <button className="engine-generate-btn" onClick={() => onGenerate(formData)}>
                        Generate Analysis
                    </button>
                    <p className="engine-generate-note">Advanced Market Simulation · Real-world Risk Factors · Dynamic Inflation</p>
                </motion.div>
            </div>
        </div>
    );
};

export default RetirementInputForm;
