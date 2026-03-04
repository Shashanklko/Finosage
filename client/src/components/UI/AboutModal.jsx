import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
                            <span className="modal-pre">PLATFORM_BRIEFING // 01</span>
                            <h2 className="modal-title">ABOUT FINO<span className="gold-text">SAGE</span></h2>

                            <div className="modal-section">
                                <h3>STOCHASTIC MODELING ENGINE</h3>
                                <p>
                                    Finosage utilizes non-linear Stochastic Differential Equations (SDE) to simulate thousands of market trajectories.
                                    By modeling returns as a Geometric Brownian Motion (GBM), we account for both deterministic drift and random volatility,
                                    capturing the "sequence of return" risk critical for retirement longevity.
                                </p>
                            </div>

                            <div className="modal-section">
                                <h3>QUASI-MONTE CARLO (SOBOL)</h3>
                                <p>
                                    Our engine leverages Sobol sequences—a low-discrepancy mathematical framework—to perform Quasi-Monte Carlo simulations.
                                    Unlike standard random sampling, Sobol sequences ensure more uniform coverage of the probability space, yielding
                                    institutional-grade accuracy with faster convergence.
                                </p>
                            </div>

                            <div className="modal-section">
                                <h3>PREVENTING EXHAUSTION</h3>
                                <p>
                                    Through dynamic programming and guardrail strategies, Finosage identifies the precise "Safe Withdrawal Rate"
                                    tailored to your unique risk tolerance and life expectancy, ensuring your wealth serves its ultimate purpose.
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
