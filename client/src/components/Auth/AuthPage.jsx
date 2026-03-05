import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './Auth.css';

const AuthPage = ({ mode = 'login', onBack, onSwitch, onAuth }) => {
    const isSignup = mode === 'signup';

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [otpStep, setOtpStep] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [pendingEmail, setPendingEmail] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const [forgotStep, setForgotStep] = useState(null); // 'email', 'otp', 'success'
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const otpRefs = useRef([]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    // OTP digit input handler
    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value.slice(-1);
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
            newOtp[i] = pasted[i] || '';
        }
        setOtp(newOtp);
        const focusIndex = Math.min(pasted.length, 5);
        otpRefs.current[focusIndex]?.focus();
    };

    // Signup / Login
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || (!isSignup && !form.password)) {
            // Forgot password step might just need email
            if (forgotStep === 'email') {
                handleForgotPassword();
                return;
            }
        }

        if (!form.email || !form.password) {
            setError('Please fill in all required fields.');
            return;
        }
        if (isSignup && form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (isSignup && form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);
        try {
            const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
            const body = isSignup
                ? { firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password }
                : { email: form.email, password: form.password };

            let res;
            let attempts = 0;
            const maxAttempts = 2;

            while (attempts < maxAttempts) {
                try {
                    res = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                    });
                    break; // Success or server error handled below
                } catch (err) {
                    attempts++;
                    if (attempts >= maxAttempts) throw err;
                    // Wait 1s before retry for transient network issues
                    await new Promise(r => setTimeout(r, 1000));
                }
            }

            const data = await res.json();

            if (!res.ok) {
                setError(data.detail || 'Something went wrong.');
                return;
            }

            if (data.needsVerification) {
                setPendingEmail(form.email.toLowerCase());
                setOtpStep(true);
                setError('');
                return;
            }

            // Login success
            localStorage.setItem('finosage_token', data.token);
            localStorage.setItem('finosage_user', JSON.stringify(data.user));
            onAuth?.(data.user);
        } catch (err) {
            setError('Network error. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    // Forgot Password - Send OTP
    const handleForgotPassword = async () => {
        if (!form.email) {
            setError('Please enter your email address.');
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.detail || 'Failed to send reset code.');
                return;
            }
            setPendingEmail(form.email.toLowerCase());
            setForgotStep('otp');
            setError('');
        } catch (err) {
            setError('Network error.');
        } finally {
            setIsLoading(false);
        }
    };

    // Reset Password - Verify OTP & Set New
    const handleResetPassword = async () => {
        const code = otp.join('');
        if (code.length !== 6) {
            setError('Please enter the 6-digit reset code.');
            return;
        }
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: pendingEmail, otp: code, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.detail || 'Reset failed.');
                return;
            }
            setForgotStep('success');
            setError('');
        } catch (err) {
            setError('Network error.');
        } finally {
            setIsLoading(false);
        }
    };

    // Verify OTP (Signup/Verification)
    const handleVerifyOtp = async () => {
        const code = otp.join('');
        if (code.length !== 6) {
            setError('Please enter the complete 6-digit code.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: pendingEmail, otp: code }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.detail || 'Verification failed.');
                return;
            }

            localStorage.setItem('finosage_token', data.token);
            localStorage.setItem('finosage_user', JSON.stringify(data.user));
            onAuth?.(data.user);
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Resend OTP
    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setIsLoading(true);
        try {
            const res = await fetch(forgotStep === 'otp' ? '/api/auth/forgot-password' : '/api/auth/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: pendingEmail }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.detail || 'Failed to resend.');
                return;
            }
            setError('');
            setOtp(['', '', '', '', '', '']);
            setResendCooldown(30);
            const timer = setInterval(() => {
                setResendCooldown(prev => {
                    if (prev <= 1) { clearInterval(timer); return 0; }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            setError('Network error.');
        } finally {
            setIsLoading(false);
        }
    };

    // ---------- Forgot Password Screens ----------
    if (forgotStep === 'email') {
        return (
            <div className="auth-container">
                <div className="auth-bg">
                    <div className="technical-grid" /><div className="radial-overlay" /><div className="glow-orb" />
                </div>
                <motion.div className="auth-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="auth-header">
                        <p className="auth-logo">FINOSAGE</p>
                        <h1 className="auth-title">Reset Password</h1>
                        <p className="auth-subtitle">Enter your email to receive a reset code</p>
                        <div className="auth-divider" />
                    </div>
                    {error && <div className="auth-error">{error}</div>}
                    <div className="auth-field">
                        <label>Email Address</label>
                        <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="your@email.com" />
                    </div>
                    <button className="auth-submit" onClick={handleForgotPassword} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Send Reset Code'}
                    </button>
                    <p className="auth-switch"><button className="auth-switch-btn" onClick={() => setForgotStep(null)}>← Back to Login</button></p>
                </motion.div>
            </div>
        );
    }

    if (forgotStep === 'otp') {
        return (
            <div className="auth-container">
                <div className="auth-bg">
                    <div className="technical-grid" /><div className="radial-overlay" /><div className="glow-orb" />
                </div>
                <motion.div className="auth-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="auth-header">
                        <p className="auth-logo">FINOSAGE</p>
                        <h1 className="auth-title">New Password</h1>
                        <p className="auth-subtitle">Enter the code sent to {pendingEmail} and your new password</p>
                        <div className="auth-divider" />
                    </div>
                    {error && <div className="auth-error">{error}</div>}
                    <div className="otp-input-row" onPaste={handleOtpPaste}>
                        {otp.map((digit, i) => (
                            <input key={i} ref={el => otpRefs.current[i] = el} type="text" inputMode="numeric" maxLength={1} className={`otp-digit ${digit ? 'filled' : ''}`} value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i, e)} autoFocus={i === 0} />
                        ))}
                    </div>
                    <div className="auth-field" style={{ marginTop: '2rem' }}>
                        <label>New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                    <button className="auth-submit" onClick={handleResetPassword} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Reset Password'}
                    </button>
                    <p className="auth-switch">Didn't receive code? <button className="auth-switch-btn" onClick={handleResend} disabled={resendCooldown > 0}>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}</button></p>
                </motion.div>
            </div>
        );
    }

    if (forgotStep === 'success') {
        return (
            <div className="auth-container">
                <div className="auth-bg">
                    <div className="technical-grid" /><div className="radial-overlay" /><div className="glow-orb" />
                </div>
                <motion.div className="auth-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="auth-header">
                        <p className="auth-logo">FINOSAGE</p>
                        <h1 className="auth-title" style={{ color: '#d4af37' }}>SUCCESS</h1>
                        <p className="auth-subtitle">Your password has been updated. You can now log in with your new credentials.</p>
                        <div className="auth-divider" />
                    </div>
                    <button className="auth-submit" onClick={() => { setForgotStep(null); setNewPassword(''); setForm({ ...form, email: pendingEmail }); }}>Sign In Now</button>
                </motion.div>
            </div>
        );
    }

    // ---------- OTP verification screen (Signup) ----------
    if (otpStep) {
        return (
            <div className="auth-container">
                <div className="auth-bg">
                    <div className="technical-grid" />
                    <div className="radial-overlay" />
                    <div className="glow-orb" />
                </div>

                <motion.div
                    className="auth-card"
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="auth-card-glow" />
                    <div className="auth-header">
                        <p className="auth-logo">FINOSAGE</p>
                        <h1 className="auth-title">Verify Email</h1>
                        <p className="auth-subtitle">
                            Enter the 6-digit code sent to <strong style={{ color: '#d4af37' }}>{pendingEmail}</strong>
                        </p>
                        <div className="auth-divider" />
                    </div>

                    {error && (
                        <motion.div className="auth-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                            {error}
                        </motion.div>
                    )}

                    <div className="otp-input-row" onPaste={handleOtpPaste}>
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => otpRefs.current[i] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                className={`otp-digit ${digit ? 'filled' : ''}`}
                                value={digit}
                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                autoFocus={i === 0}
                            />
                        ))}
                    </div>

                    <button className="auth-submit" onClick={handleVerifyOtp} style={{ marginTop: '1.5rem' }} disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Verify & Continue'}
                    </button>

                    <p className="auth-switch" style={{ marginTop: '1.5rem' }}>
                        Didn't receive the code?
                        <button
                            className="auth-switch-btn"
                            onClick={handleResend}
                            disabled={resendCooldown > 0}
                            style={resendCooldown > 0 ? { opacity: 0.3, cursor: 'default' } : {}}
                        >
                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                        </button>
                    </p>

                    <p className="auth-switch">
                        <button className="auth-switch-btn" onClick={() => { setOtpStep(false); setOtp(['', '', '', '', '', '']); setError(''); }}>
                            ← Back to Signup
                        </button>
                    </p>
                </motion.div>
            </div>
        );
    }

    // ---------- Login / Signup screen ----------
    return (
        <div className="auth-container">
            <div className="auth-bg">
                <div className="technical-grid" />
                <div className="radial-overlay" />
                <div className="glow-orb" />
            </div>

            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="auth-card-glow" />
                <div className="auth-header">
                    <p className="auth-logo">FINOSAGE</p>
                    <h1 className="auth-title">{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
                    <p className="auth-subtitle">
                        {isSignup ? 'Join the analytical engine' : 'Sign in to your workspace'}
                    </p>
                    <div className="auth-divider" />
                </div>

                {error && (
                    <motion.div className="auth-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="auth-name-row">
                            <div className="auth-field">
                                <label>First Name</label>
                                <input type="text" value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} placeholder="John" />
                            </div>
                            <div className="auth-field">
                                <label>Last Name</label>
                                <input type="text" value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} placeholder="Doe" />
                            </div>
                        </div>
                    )}

                    <div className="auth-field">
                        <label>Email Address</label>
                        <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="your@email.com" autoComplete="email" />
                    </div>

                    <div className="auth-field">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ margin: 0 }}>Password</label>
                            {!isSignup && (
                                <button type="button" className="auth-switch-btn" style={{ textTransform: 'none', fontSize: '0.55rem', opacity: 0.7 }} onClick={() => setForgotStep('email')}>
                                    Forgot Password?
                                </button>
                            )}
                        </div>
                        <div className="auth-password-wrap">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                placeholder="••••••••"
                                autoComplete={isSignup ? 'new-password' : 'current-password'}
                            />
                            <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                                {showPassword ? '◉' : '◎'}
                            </button>
                        </div>
                    </div>

                    {isSignup && (
                        <div className="auth-field">
                            <label>Confirm Password</label>
                            <div className="auth-password-wrap">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="auth-submit" disabled={isLoading}>
                        {isLoading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
                    </button>
                </form>

                <p className="auth-switch">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}
                    <button className="auth-switch-btn" onClick={onSwitch}>
                        {isSignup ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </motion.div>
        </div>
    );

};

export default AuthPage;
