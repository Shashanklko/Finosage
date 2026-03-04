import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Profile.css';

const ProfilePage = ({ onBack, onHistoryClick }) => {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        age: '',
        retirementAge: '',
        monthlyExpenses: '',
        riskTolerance: 'Balanced',
        currency: 'USD'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const currencySymbols = {
        USD: '$', EUR: '€', INR: '₹', AED: 'د.إ', SAR: '﷼',
        AUD: 'A$', CAD: 'C$', RUB: '₽', JPY: '¥', KRW: '₩',
        ZAR: 'R', NGN: '₦', GBP: '£', EGP: 'E£'
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('finosage_token');
        if (!token) {
            onBack();
            return;
        }

        try {
            const res = await fetch(`/api/auth/profile?token=${token}`);
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                setForm({
                    firstName: data.user.firstName || '',
                    lastName: data.user.lastName || '',
                    age: data.user.age || '',
                    retirementAge: data.user.retirementAge || '',
                    monthlyExpenses: data.user.monthlyExpenses || '',
                    riskTolerance: data.user.riskTolerance || 'Balanced',
                    currency: data.user.currency || 'USD'
                });
            } else {
                setError(data.detail || 'Failed to load profile.');
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem('finosage_token');
        try {
            const res = await fetch(`/api/auth/profile?token=${token}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    age: form.age ? parseInt(form.age) : null,
                    retirementAge: form.retirementAge ? parseInt(form.retirementAge) : null,
                    monthlyExpenses: form.monthlyExpenses ? parseFloat(form.monthlyExpenses) : null,
                    riskTolerance: form.riskTolerance,
                    currency: form.currency
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('Profile updated successfully!');
                setUser(data.user);
                localStorage.setItem('finosage_user', JSON.stringify(data.user));
            } else {
                setError(data.detail || 'Update failed.');
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="profile-container loading">
                <div className="loader-spinner"></div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-background">
                <div className="technical-grid" />
                <div className="radial-overlay" />
            </div>

            <button className="profile-back" onClick={onBack}>
                ← DISCOVERY
            </button>

            <motion.div
                className="profile-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="profile-header">
                    <div className="header-nav">
                        <button type="button" className="inner-back-btn" onClick={onBack}>← BACK</button>
                        <button type="button" className="history-btn" onClick={onHistoryClick}>ANALYSIS HISTORY</button>
                    </div>
                    <p className="profile-tag">ACCOUNT SETTINGS</p>
                    <h2 className="profile-title">USER PROFILE</h2>
                    <div className="profile-divider" />
                </div>

                {error && <div className="profile-error">{error}</div>}
                {success && <div className="profile-success">{success}</div>}

                <form onSubmit={handleSave} className="profile-form">
                    <div className="form-section">
                        <h3 className="section-label">Personal Identity</h3>
                        <div className="profile-row">
                            <div className="profile-field">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={form.firstName}
                                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                />
                            </div>
                            <div className="profile-field">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={form.lastName}
                                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-field readonly">
                                <label>Email Address</label>
                                <input type="email" value={user?.email || ''} disabled />
                            </div>
                            <div className="profile-field">
                                <label>Preferred Currency</label>
                                <select
                                    value={form.currency}
                                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                                >
                                    <optgroup label="Global">
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="JPY">JPY (¥)</option>
                                        <option value="AUD">AUD (A$)</option>
                                        <option value="CAD">CAD (C$)</option>
                                    </optgroup>
                                    <optgroup label="Asia & Middle East">
                                        <option value="INR">INR (₹)</option>
                                        <option value="AED">AED (د.إ)</option>
                                        <option value="SAR">SAR (﷼)</option>
                                        <option value="KRW">KRW (₩)</option>
                                    </optgroup>
                                    <optgroup label="Europe & Others">
                                        <option value="RUB">RUB (₽)</option>
                                    </optgroup>
                                    <optgroup label="Africa">
                                        <option value="ZAR">ZAR (R)</option>
                                        <option value="NGN">NGN (₦)</option>
                                        <option value="EGP">EGP (E£)</option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-label">Financial Parameters</h3>
                        <div className="profile-row">
                            <div className="profile-field">
                                <label>Current Age</label>
                                <select
                                    value={form.age}
                                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                                >
                                    <option value="">Select Age</option>
                                    {Array.from({ length: 83 }, (_, i) => i + 18).map(age => (
                                        <option key={age} value={age}>{age}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="profile-field">
                                <label>Target Retirement</label>
                                <select
                                    value={form.retirementAge}
                                    onChange={(e) => setForm({ ...form, retirementAge: e.target.value })}
                                >
                                    <option value="">Select Age</option>
                                    {Array.from({ length: 61 }, (_, i) => i + 40).map(age => (
                                        <option key={age} value={age}>{age}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-field">
                                <label>Monthly Expenses ({currencySymbols[form.currency]})</label>
                                <input
                                    type="number"
                                    value={form.monthlyExpenses}
                                    onChange={(e) => setForm({ ...form, monthlyExpenses: e.target.value })}
                                    placeholder="5000"
                                />
                            </div>
                            <div className="profile-field">
                                <label>Risk Tolerance</label>
                                <select
                                    value={form.riskTolerance}
                                    onChange={(e) => setForm({ ...form, riskTolerance: e.target.value })}
                                >
                                    <option value="Conservative">Conservative</option>
                                    <option value="Balanced">Balanced</option>
                                    <option value="Aggressive">Aggressive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="profile-submit" disabled={isSaving}>
                        {isSaving ? 'UPDATING ENGINE...' : 'SAVE PREFERENCES'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ProfilePage;
