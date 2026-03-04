import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, TrendingDown, Activity } from 'lucide-react';
import './BehavioralCards.css';

const BehavioralRiskCards = ({ metrics, maxDrawdown }) => {
    if (!metrics) return null;

    const cards = [
        {
            title: "Stress Level Risk",
            icon: <AlertTriangle size={18} />,
            desc: "Risk of feeling panic (Market fall odds)",
            stats: [
                { label: "-20% Drop", value: `${metrics.emotionalRisk?.drop20 ?? 0}%`, alert: metrics.emotionalRisk?.drop20 > 50 },
                { label: "-40% Drop", value: `${metrics.emotionalRisk?.drop40 ?? 0}%`, alert: metrics.emotionalRisk?.drop40 > 25 },
                { label: "-60% Drop", value: `${metrics.emotionalRisk?.drop60 ?? 0}%`, alert: metrics.emotionalRisk?.drop60 > 10 }
            ]
        },
        {
            title: "Worst-Case & Recovery",
            icon: <Clock size={18} />,
            desc: "Largest drop and time to bounce back",
            stats: [
                { label: "Worst Drop", value: `${maxDrawdown}%`, alert: maxDrawdown < -50 },
                { label: "Avg Years to Recover", value: metrics.recovery?.averageYearsUnderwater ?? 0, alert: metrics.recovery?.averageYearsUnderwater > 3 }
            ]
        },
        {
            title: "Loss Risk",
            icon: <TrendingDown size={18} />,
            desc: "Likelihood of your value being down",
            stats: [
                { label: "Year 1", value: `${metrics.lossProbability?.['1Y'] ?? 0}%`, alert: metrics.lossProbability?.['1Y'] > 30 },
                { label: "Year 3", value: `${metrics.lossProbability?.['3Y'] ?? 0}%`, alert: metrics.lossProbability?.['3Y'] > 15 },
                { label: "Year 5", value: `${metrics.lossProbability?.['5Y'] ?? 0}%`, alert: metrics.lossProbability?.['5Y'] > 5 }
            ]
        },
        {
            title: "Economic Condition Shift",
            icon: <Activity size={18} />,
            desc: "Expected growth during different market states",
            stats: [
                { label: "Growth Period", value: `${metrics.regimeShift?.growthCAGR ?? 0}%`, alert: false },
                { label: "Stress Period", value: `${metrics.regimeShift?.stressCAGR ?? 0}%`, alert: metrics.regimeShift?.stressCAGR < -10 },
                { label: "Market Penalty", value: `${((metrics.regimeShift?.growthCAGR ?? 0) - (metrics.regimeShift?.stressCAGR ?? 0)).toFixed(1)}%`, alert: false }
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
