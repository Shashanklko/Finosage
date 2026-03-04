import { motion, AnimatePresence } from 'framer-motion';
import { Target, Shield, Zap, Activity, Info, TrendingUp } from 'lucide-react';
import './AboutModal.css';

const AboutModal = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="modal-content"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <button className="close-btn" onClick={onClose}>×</button>

                        <div className="modal-inner">
                            <span className="modal-pre">THE_FINOSAGE_STORY // 01</span>
                            <h2 className="modal-title">THE HEART OF FINO<span className="gold-text">SAGE</span></h2>

                            <div className="modal-section intro-section">
                                <div className="section-header">
                                    <Info className="section-icon" size={18} />
                                    <h3>A NEW VISION FOR WEALTH</h3>
                                </div>
                                <p>
                                    Finosage wasn't born out of a desire to build more charts, but from a simple observation: <strong>numbers alone don't tell the whole story.</strong> Most financial tools treat your life like a straight line on a graph—predictable, static, and safe. But life isn't a straight line.
                                </p>
                            </div>

                            <div className="modal-section">
                                <div className="section-header">
                                    <Target className="section-icon" size={18} />
                                    <h3>THE GAP IN THE MAP</h3>
                                </div>
                                <p>
                                    We saw people planning their entire futures based on "average" returns and "best-case" guesses. We built Finosage because "average" isn't good enough when your retirement is on the line. We wanted to build a bridge between mathematical certainty and human peace of mind.
                                </p>
                            </div>

                            <div className="modal-section">
                                <div className="section-header">
                                    <Zap className="section-icon" size={18} />
                                    <h3>CLARITY THROUGH CHAOS</h3>
                                </div>
                                <p>
                                    Imagine being able to "stress-test" your future. Finosage helps you see through the fog of market volatility. We don't just tell you how much you have; we tell you <strong>how long it will last</strong> if the world gets messy. It's about turning "I hope" into "I know."
                                </p>
                            </div>

                            <div className="modal-section scenarios-section">
                                <div className="section-header">
                                    <Activity className="section-icon" size={18} />
                                    <h3>HUMAN CHAPTERS</h3>
                                </div>
                                <div className="scenario-item">
                                    <span className="scenario-label">THE QUIET RETIREMENT:</span>
                                    <p>"I want to know that even if the stock market dips next year, my monthly income remains untouched."</p>
                                </div>
                                <div className="scenario-item">
                                    <span className="scenario-label">THE LEGACY BUILDER:</span>
                                    <p>"I need to see exactly how much I can leave for my children without compromising my own medical care."</p>
                                </div>
                            </div>

                            <div className="modal-section mechanism-section">
                                <div className="section-header">
                                    <Shield className="section-icon" size={18} />
                                    <h3>THE MATHEMATICAL SOUL</h3>
                                </div>
                                <p>
                                    Behind the simple interface lies a relentless simulation engine. We follow a <strong>Stochastic Regime-Switching</strong> mechanism that mirrors the real world's unpredictability. We run 10,000 parallel realities for every plan, so yours can thrive in the one that actually happens.
                                </p>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="divider" />
                            <span className="status-text">SYSTEMS_ACTIVE // SECURE_ACCESS_GRANTED</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AboutModal;
