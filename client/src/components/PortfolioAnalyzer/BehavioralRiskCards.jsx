import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, TrendingDown, Activity } from 'lucide-react';
import './BehavioralCards.css';

const BehavioralRiskCards = ({ metrics, maxDrawdown }) => {
    if (!metrics) return null;

    const cards = [
        {
            title: "Emotional Risk",
            icon: <AlertTriangle size={18} />,
            desc: "Panic thresholds (probability of hitting)",
            stats: [
                { label: "-20% Drop", value: `${metrics.emotionalRisk?.drop20 ?? 0}%`, alert: metrics.emotionalRisk?.drop20 > 50 },
                { label: "-40% Drop", value: `${metrics.emotionalRisk?.drop40 ?? 0}%`, alert: metrics.emotionalRisk?.drop40 > 25 },
                { label: "-60% Drop", value: `${metrics.emotionalRisk?.drop60 ?? 0}%`, alert: metrics.emotionalRisk?.drop60 > 10 }
            ]
        },
        {
            title: "Max Drawdown & Recovery",
            icon: <Clock size={18} />,
            desc: "Worst case and time underwater",
            stats: [
                { label: "Worst Drawdown", value: `${maxDrawdown}%`, alert: maxDrawdown < -50 },
                { label: "Avg Years Underwater", value: metrics.recovery?.averageYearsUnderwater ?? 0, alert: metrics.recovery?.averageYearsUnderwater > 3 }
            ]
        },
        {
            title: "Loss Probability",
            icon: <TrendingDown size={18} />,
            desc: "Likelihood of being negative at horizon",
            stats: [
                { label: "Year 1", value: `${metrics.lossProbability?.['1Y'] ?? 0}%`, alert: metrics.lossProbability?.['1Y'] > 30 },
                { label: "Year 3", value: `${metrics.lossProbability?.['3Y'] ?? 0}%`, alert: metrics.lossProbability?.['3Y'] > 15 },
                { label: "Year 5", value: `${metrics.lossProbability?.['5Y'] ?? 0}%`, alert: metrics.lossProbability?.['5Y'] > 5 }
            ]
        },
        {
            title: "Market Regime Shift",
            icon: <Activity size={18} />,
            desc: "Expected CAGR during different macro states",
            stats: [
                { label: "Growth Regime", value: `${metrics.regimeShift?.growthCAGR ?? 0}%`, alert: false },
                { label: "Stress Regime", value: `${metrics.regimeShift?.stressCAGR ?? 0}%`, alert: metrics.regimeShift?.stressCAGR < -10 },
                { label: "Crisis Penalty", value: `${((metrics.regimeShift?.growthCAGR ?? 0) - (metrics.regimeShift?.stressCAGR ?? 0)).toFixed(1)}%`, alert: false }
            ]
        }
    ];

    return (
        <motion.div
            className="behavioral-cards-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
        >
            {cards.map((card, i) => (
                <div key={i} className="behavioral-card">
                    <div className="bc-header">
                        <div className="bc-icon-wrap">{card.icon}</div>
                        <div>
                            <h4 className="bc-title">{card.title}</h4>
                            <p className="bc-desc">{card.desc}</p>
                        </div>
                    </div>
                    <div className="bc-stats">
                        {card.stats.map((s, j) => (
                            <div key={j} className="bc-stat-row">
                                <span className="bc-stat-label">{s.label}</span>
                                <span className={`bc-stat-value ${s.alert ? 'alert' : ''}`}>{s.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </motion.div>
    );
};

export default BehavioralRiskCards;
