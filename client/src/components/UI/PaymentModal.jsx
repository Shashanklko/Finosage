import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CreditCard, Award, ArrowUpRight, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, user, onSuccess, onAuthRedirect }) => {
    const [paymentId, setPaymentId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState('pay'); // 'pay', 'claimed'

    const handleClaim = async (e) => {
        e.preventDefault();
        if (!paymentId.trim()) return;

        setIsLoading(true);
        setError('');
        const token = localStorage.getItem('finosage_token');

        try {
            const res = await fetch('/api/auth/claim-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    paymentId: paymentId.trim()
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setStep('claimed');
                if (onSuccess) {
                    onSuccess(data.credits);
                }
            } else {
                setError(data.detail || 'Failed to verify payment reference. Please check and try again.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="payment-modal-overlay">
                <motion.div
                    className="payment-modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />
                
                <motion.div
                    className="payment-modal-content"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <button className="payment-close-btn" onClick={onClose}>×</button>

                    <div className="payment-modal-inner">
                        <span className="payment-modal-pre">PREMIUM ACCESS // CREDIT GATE</span>
                        
                        {!user ? (
                            <div className="payment-unauthorized">
                                <AlertTriangle className="unauth-icon" size={48} />
                                <h2 className="payment-modal-title">ACCOUNT REQUIRED</h2>
                                <p className="payment-desc">
                                    To secure your purchased premium simulations and save your personalized wealth portfolios, you must first create a free account or login.
                                </p>
                                <button className="payment-auth-btn" onClick={() => { onClose(); onAuthRedirect(); }}>
                                    LOGIN / SIGNUP
                                </button>
                            </div>
                        ) : step === 'pay' ? (
                            <div className="payment-flow">
                                <h2 className="payment-modal-title">
                                    UNLOCK <span className="gold-text">PREMIUM</span> REPORTS
                                </h2>
                                <p className="payment-desc">
                                    You've utilized your free simulations credit. Unlock <strong>3 more premium simulations</strong> with custom PDF summaries and infinite save capability for only <strong>₹100</strong>.
                                </p>

                                <div className="payment-step-card">
                                    <div className="step-number">STEP 1</div>
                                    <div className="step-body">
                                        <h4>Pay ₹100 via Razorpay</h4>
                                        <p>Make your instant payment using standard UPI, Cards or NetBanking on our secure Razorpay portal.</p>
                                        <a 
                                            href="https://razorpay.me/@nowayside" 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="razorpay-link-btn"
                                        >
                                            PAY ₹100 ON RAZORPAY <ArrowUpRight size={14} />
                                        </a>
                                    </div>
                                </div>

                                <div className="payment-step-card">
                                    <div className="step-number">STEP 2</div>
                                    <div className="step-body">
                                        <h4>Enter Transaction Reference</h4>
                                        <p>Paste the Razorpay Payment ID (e.g. <code>pay_XXXXXX</code>) or UPI Transaction Ref No from your payment confirmation.</p>
                                        
                                        <form onSubmit={handleClaim} className="claim-form">
                                            <div className="claim-input-group">
                                                <input 
                                                    type="text" 
                                                    placeholder="pay_PJyF8rM1xL0d91 or UPI Ref No"
                                                    value={paymentId}
                                                    onChange={(e) => setPaymentId(e.target.value)}
                                                    disabled={isLoading}
                                                    required
                                                />
                                                <button type="submit" className="claim-submit-btn" disabled={isLoading || !paymentId.trim()}>
                                                    {isLoading ? (
                                                        <Loader2 className="spinner-icon" size={16} />
                                                    ) : (
                                                        "CLAIM CREDITS"
                                                    )}
                                                </button>
                                            </div>
                                            {error && <div className="claim-error-msg">{error}</div>}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="payment-success-screen">
                                <CheckCircle2 className="success-check-icon" size={64} />
                                <h2 className="payment-modal-title success">CREDITS UNLOCKED!</h2>
                                <p className="payment-desc">
                                    Payment successfully verified. <strong>3 Premium Simulations Credits</strong> have been added to your account! You can now generate, stress-test, and save your strategic financial forecasts.
                                </p>
                                <div className="success-credits-badge">
                                    <Award size={18} />
                                    <span>3 SIMULATIONS AVAILABLE</span>
                                </div>
                                <button className="payment-continue-btn" onClick={onClose}>
                                    CONTINUE
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="payment-modal-footer">
                        <div className="divider" />
                        <div className="footer-status-row">
                            <span className="status-text">SECURE_SSL // SHA-256_ACTIVE</span>
                            <span className="status-text flex-align"><Shield size={10} style={{ marginRight: '4px' }} /> ENCRYPTED CONNECTION</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentModal;
