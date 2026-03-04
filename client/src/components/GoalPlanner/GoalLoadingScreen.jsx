import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const cyclingTexts = [
    'Constructing Multi-Goal Optimization Tree...',
    'Running Quasi-Monte Carlo Simulations...',
    'Applying Dynamic Programming Backward Induction...',
    'Computing Goal-Specific Success Probabilities...',
    'Analyzing Priority-Weighted Capital Allocation...',
    'Generating Optimal Funding Trajectories...',
];

const GoalLoadingScreen = ({ onComplete }) => {
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
            <h1>Optimizing Your Financial Goals</h1>
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

export default GoalLoadingScreen;
