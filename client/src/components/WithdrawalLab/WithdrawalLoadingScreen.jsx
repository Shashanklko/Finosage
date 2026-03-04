import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const cyclingTexts = [
    'Calibrating Guardrail Boundaries...',
    'Running Quasi-Monte Carlo Return Sequences...',
    'Applying DP Backward Induction on Cash-Flow Tree...',
    'Stress-Testing Under Inflation Surge Scenario...',
    'Computing Optimal Withdrawal Schedule...',
    'Evaluating Sequence-of-Return Risk Impacts...',
];

const WithdrawalLoadingScreen = ({ onComplete }) => {
    const [textIndex, setTextIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex(prev => (prev + 1) % cyclingTexts.length);
        }, 550);
        const timer = setTimeout(() => onComplete(), 3500);
        return () => { clearInterval(interval); clearTimeout(timer); };
    }, [onComplete]);

    return (
        <motion.div className="engine-loading" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <div className="engine-spinner" />
            <h1>Stress-Testing Withdrawal Strategies</h1>
            <AnimatePresence mode="wait">
                <motion.p
                    key={textIndex}
                    className="engine-loading-text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {cyclingTexts[textIndex]}
                </motion.p>
            </AnimatePresence>
        </motion.div>
    );
};

export default WithdrawalLoadingScreen;
