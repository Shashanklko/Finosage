import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = ({ onExplore }) => {
    return (
        <div className="hero-container">
            {/* Background Layer */}
            <div className="hero-background">
                <div className="fintech-grid" />
                <div className="ambient-glow" />
                <div className="vignette" />
            </div>

            {/* Symmetrical Split - Professional Images */}
            <div className="professional-side left">
                <motion.div
                    className="image-wrapper"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                >
                    <img src="/assets/woman.png" alt="Executive Director" className="hero-image" />
                </motion.div>
            </div>

            <div className="professional-side right">
                <motion.div
                    className="image-wrapper"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                >
                    <img src="/assets/man.png" alt="Managing Partner" className="hero-image" />
                </motion.div>
            </div>

            {/* Central Content Column */}
            <motion.div
                className="hero-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
            >
                <span className="pre-title">STRATEGIC FINANCIAL INTELLIGENCE</span>
                <h1 className="headline vertical">
                    <span className="line"><span className="gold-text">PRECISION</span> YOU CAN TRUST.</span>
                    <span className="line"><span className="gold-text">GROWTH</span> YOU CAN FEEL CONFIDENT IN.</span>
                </h1>
                <p className="description centered">
                    Advanced analytics and predictive modeling —<br />
                    guided by a deep understanding of your ambitions.<br />
                    <span className="emphasis">Because wealth is personal.</span>
                </p>
                <motion.button
                    className="explore-button"
                    onClick={onExplore}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    
                   < Let's explore financial Journey >
                </motion.button>

            </motion.div>
        </div>
    );
};

export default Hero;
