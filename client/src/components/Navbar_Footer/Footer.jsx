import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = ({ onHomeClick, onAboutClick }) => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <motion.div
                    className="footer-left"
                    whileHover={{ opacity: 0.8 }}
                    onClick={onHomeClick}
                >
                    <span className="footer-logo">FINO<span className="gold-text">SAGE</span></span>
                </motion.div>

                <div className="footer-center">
                    <span className="copyright">© 2026 FINOSAGE. ALL RIGHTS RESERVED.</span>
                </div>

                <motion.div
                    className="footer-right"
                    whileHover={{ color: '#d4af37' }}
                    onClick={onAboutClick}
                >
                    <span className="about-trigger">ABOUT US</span>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
