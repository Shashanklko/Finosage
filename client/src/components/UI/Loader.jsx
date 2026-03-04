import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Loader.css';

const Loader = ({ onLoadingComplete }) => {
    const [text, setText] = useState('');
    const fullText = 'FINOSAGE';

    useEffect(() => {
        let currentIdx = 0;
        const interval = setInterval(() => {
            if (currentIdx <= fullText.length) {
                setText(fullText.slice(0, currentIdx));
                currentIdx++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    onLoadingComplete();
                }, 1000); // Hold for a second before transitioning
            }
        }, 150); // Speed of character reveal

        return () => clearInterval(interval);
    }, [onLoadingComplete]);

    return (
        <motion.div
            className="loader-container"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="loader-content">
                <motion.h1
                    className="loader-logo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {text.split('').map((char, index) => (
                        <span key={index} className={index >= 4 ? "gold-text" : ""}>
                            {char}
                        </span>
                    ))}
                    <motion.span
                        className="cursor"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    >
                        |
                    </motion.span>
                </motion.h1>
                <div className="loader-line-container">
                    <motion.div
                        className="loader-line"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default Loader;
