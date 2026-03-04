import React from 'react';
import { motion } from 'framer-motion';
import { formatINR } from '../../../utils/formatCurrency';

const InsightCards = ({ dynamicMetrics, hero }) => {
    if (!dynamicMetrics) return null;

    const dm = dynamicMetrics;

    // Retirement Readiness Grade
    const score = dm.healthScore ?? 0;
    const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D';
    const gradeLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'On Track' : score >= 40 ? 'Needs Work' : 'At Risk';
    const gradeColor = score >= 80 ? '#34D399' : score >= 60 ? '#60A5FA' : score >= 40 ? '#FBBF24' : '#F87171';

    const cards = [
        {
            icon: '💰',
            title: 'Monthly Retirement Pay',
            value: dm.monthlyIncome ? formatINR(dm.monthlyIncome) : '—',
            desc: 'Sustainable monthly income from your savings at retirement',
        },
        {
            icon: '📅',
            title: 'Years Covered',
            value: dm.yearsCovered != null ? `${dm.yearsCovered} yrs` : '—',
            desc: 'How long your savings support your yearly spending',
        },
        {
            icon: '🎯',
            title: 'Savings Shortfall',
            value: dm.savingsGap > 0 ? formatINR(dm.savingsGap) : '✓ On Track',
            desc: dm.savingsGap > 0 ? 'Difference between what you need and what you\'ll have' : 'Your savings meet the required target',
        },
        {
            icon: '📊',
            title: 'Readiness Grade',
            value: grade,
            desc: gradeLabel,
            color: gradeColor,
        },
    ];

    return (
        <motion.div
            className="insight-cards-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            {cards.map((card, i) => (
                <motion.div
                    key={i}
                    className="insight-card"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                >
                    <span className="insight-icon">{card.icon}</span>
                    <p className="insight-title">{card.title}</p>
                    <p className="insight-value" style={card.color ? { color: card.color } : {}}>
                        {card.value}
                    </p>
                    <p className="insight-desc">{card.desc}</p>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default InsightCards;
