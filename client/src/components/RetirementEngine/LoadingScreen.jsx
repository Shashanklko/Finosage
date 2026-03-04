import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const cyclingTexts = [
    'Running 10,000 Monte Carlo Paths...',
    'Applying DP Backward Induction on Cash-Flow Tree...',
    'Computing Survival Probability Surface...',
    'Optimizing Withdrawal Policy via Dynamic Programming...',
    'Analyzing Sequence-of-Return Risk...',
    'Evaluating DP Value Function at Each State...',
];

const LoadingScreen = ({ onComplete }) => {
    const [textIndex, setTextIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex(prev => (prev + 1) % cyclingTexts.length);
        }, 700);
        const timer = setTimeout(() => onComplete(), 3200);
        return () => { clearInterval(interval); clearTimeout(timer); };
    }, [onComplete]);

    return (
        <motion.div className="engine-loading" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <div className="engine-spinner" />
            <h1>Engineering Your Retirement Outcome</h1>
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

export default LoadingScreen;
