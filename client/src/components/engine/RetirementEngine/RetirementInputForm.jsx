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
        currentAge: '', retirementAge: '', lifeExpectancy: '',
        portfolioValue: '', monthlyContribution: '',
        expectedReturn: '', volatility: '', inflationRate: '',
        annualWithdrawal: '', strategy: 'guardrail'
    });
    const [error, setError] = React.useState('');

    const [touchedFields, setTouchedFields] = React.useState({});

    const handleChange = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleBlur = (id) => {
        setTouchedFields(prev => ({ ...prev, [id]: true }));
    };

    const getFieldError = (id) => {
        const { currentAge, retirementAge, lifeExpectancy, portfolioValue, monthlyContribution } = formData;

        switch (id) {
            case 'currentAge':
                if (currentAge !== '' && (Number(currentAge) < 15 || Number(currentAge) > 100)) return 'Current age must be between 15 and 100.';
                break;
            case 'retirementAge':
                if (retirementAge !== '' && currentAge !== '' && Number(retirementAge) <= Number(currentAge)) return 'Retirement age must be greater than current age.';
                break;
            case 'lifeExpectancy':
                if (lifeExpectancy !== '' && Number(lifeExpectancy) > 130) return 'Life expectancy cannot exceed 130 years.';
                if (lifeExpectancy !== '' && retirementAge !== '' && Number(lifeExpectancy) <= Number(retirementAge)) return 'Life expectancy must be greater than retirement age.';
                break;
            case 'portfolioValue':
                if (portfolioValue !== '' && Number(portfolioValue) < 0) return 'Invalid savings.';
                break;
            case 'monthlyContribution':
                if (monthlyContribution !== '' && Number(monthlyContribution) < 0) return 'Invalid contribution.';
                break;
            default:
                return null;
        }
        return null;
    };

    const validate = () => {
        const { currentAge, retirementAge, lifeExpectancy, portfolioValue, monthlyContribution } = formData;

        if (currentAge === '' || retirementAge === '' || lifeExpectancy === '' || portfolioValue === '' || monthlyContribution === '') {
            setError('');
            return false;
        }

        const ageError = getFieldError('currentAge') || getFieldError('retirementAge') || getFieldError('lifeExpectancy');
        if (ageError) {
            setError(ageError);
            return false;
        }

        setError('');
        return true;
    };

    React.useEffect(() => {
        validate();
    }, [formData]);

    const isFormValid = () => {
        const { currentAge, retirementAge, lifeExpectancy, portfolioValue, monthlyContribution } = formData;
        return currentAge !== '' && retirementAge !== '' && lifeExpectancy !== '' &&
            portfolioValue !== '' && monthlyContribution !== '' && !error;
    };

    const handleSubmit = () => {
        if (validate()) {
            onGenerate(Object.fromEntries(
                Object.entries(formData).map(([k, v]) => [k, k === 'strategy' ? v : Number(v)])
            ));
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
                            <div className={`engine-input-wrap ${touchedFields[field.id] && getFieldError(field.id) ? 'has-error' : ''}`}>
                                <input
                                    type="number"
                                    value={formData[field.id]}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    onBlur={() => handleBlur(field.id)}
                                    placeholder={field.placeholder}
                                />
                                <span className="engine-input-unit">{field.unit}</span>
                                <div className="engine-stepper">
                                    <button className="engine-stepper-btn" onClick={() => { handleChange(field.id, Number(formData[field.id] || 0) + 1); handleBlur(field.id); }}>▲</button>
                                    <button className="engine-stepper-btn" onClick={() => { handleChange(field.id, Number(formData[field.id] || 0) - 1); handleBlur(field.id); }}>▼</button>
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
                    {error && <p className="auth-error" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{error}</p>}
                    <button
                        className="engine-generate-btn"
                        onClick={handleSubmit}
                        disabled={!isFormValid()}
                        style={!isFormValid() ? { opacity: 0.5, cursor: 'not-allowed', filter: 'grayscale(1)' } : {}}
                    >
                        Generate Analysis
                    </button>
                    <p className="engine-generate-note">Advanced Market Simulation · Real-world Risk Factors · Dynamic Inflation</p>
                </motion.div>
            </div>
        </div>
    );
};

export default RetirementInputForm;
