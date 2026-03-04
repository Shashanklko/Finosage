import React from 'react';
import { motion } from 'framer-motion';
import './Discovery.css';

const ModuleIcon = ({ type }) => {
    const icons = {
        retirement: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="module-icon">
                <path d="M3 20h18" />
                <path d="M5 20V10l3-4h8l3 4v10" />
                <path d="M9 20v-6h6v6" />
                <path d="M12 6V3" />
                <path d="M10 3h4" />
            </svg>
        ),
        analyzer: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="module-icon">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v9l6.5 3.5" />
                <path d="M12 12L6 8" />
            </svg>
        ),
        planner: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="module-icon">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <path d="M12 3v2" />
                <path d="M12 19v2" />
                <path d="M3 12h2" />
                <path d="M19 12h2" />
            </svg>
        ),
        lab: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="module-icon">
                <path d="M9 3h6" />
                <path d="M10 3v5.5L5 18.5a1 1 0 001 1.5h12a1 1 0 001-1.5L14 8.5V3" />
                <path d="M8.5 14h7" />
            </svg>
        )
    };
    return icons[type] || null;
};

const Discovery = ({ onBack, onModuleClick, onAuthClick }) => {
    const moduleRoutes = { retirement: 'retirement', analyzer: 'analyzer', planner: 'planner', lab: 'lab' };
    const modules = [
        {
            id: 'retirement',
            title: 'Retirement Wealth Manager',
            description: 'Monte Carlo + Dynamic Programming survival modeling for capital longevity across multi-decade horizons.'
        },
        {
            id: 'analyzer',
            title: 'Portfolio Analyzer',
            description: 'Stochastic risk decomposition to optimize asset efficiency and volatility.'
        },
        {
            id: 'planner',
            title: 'Wealth Goal Planner',
            description: 'Precision milestone targeting through path-dependent sequence modeling.'
        },
        {
            id: 'lab',
            title: 'Withdrawal Strategy Lab',
            description: 'Dynamic guardrail testing for inflation-adjusted optimal cash-flow.'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div className="discovery-container">
            <div className="discovery-background">
                <div className="technical-grid" />
                <div className="radial-overlay" />
                <div className="glow-orb" />
            </div>



            <motion.div
                className="discovery-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="discovery-title">THE ANALYTICAL ENGINE</h2>
                <div className="divider" />
            </motion.div>

            <motion.div
                className="pillars-grid four-modules"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {modules.map((module, index) => (
                    <motion.div
                        key={module.id}
                        className={`pillar-card minimal-card ${moduleRoutes[module.id] ? 'cursor-pointer' : 'cursor-default'}`}
                        variants={itemVariants}
                        onClick={() => moduleRoutes[module.id] && onModuleClick?.(moduleRoutes[module.id])}
                        whileHover={{
                            y: -4,
                            borderColor: 'rgba(212, 175, 55, 0.35)',
                            transition: { duration: 0.3 }
                        }}
                    >
                        <div className="card-top-row">
                            <div className="pillar-index">0{index + 1}</div>
                            <ModuleIcon type={module.id} />
                        </div>
                        <h3 className="pillar-title">{module.title}</h3>
                        <p className="pillar-description">{module.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Discovery;
