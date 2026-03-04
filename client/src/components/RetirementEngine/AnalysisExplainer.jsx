import React from 'react';
import { motion } from 'framer-motion';
import { formatINR } from '../../utils/formatCurrency';

const AnalysisExplainer = ({ results, formData }) => {
    if (!results || !formData) return null;

    const { hero, riskGrid, summary, dynamicMetrics } = results;

    const getInsights = () => {
        const insights = [];

        // 1. Success Rate Insight
        if (hero.survivalRate >= 90) {
            insights.push({
                title: 'Longevity Verdict',
                text: `Your plan survived ${hero.survivalRate}% of all regime-switching scenarios, including prolonged stress periods with fat-tail crashes.`,
                icon: '🛡️',
                type: 'positive'
            });
        } else if (hero.survivalRate >= 70) {
            insights.push({
                title: 'Stability Check',
                text: `With a ${hero.survivalRate}% success rate across regime shifts, your plan is solid but sensitive to consecutive stress years.`,
                icon: '⚖️',
                type: 'neutral'
            });
        } else {
            insights.push({
                title: 'Risk Alert',
                text: 'Under regime-switching conditions, your plan shows high exhaustion risk. Consider boosting contributions or extending your working years.',
                icon: '⚠️',
                type: 'negative'
            });
        }

        // 2. Inflation Shock
        if (dynamicMetrics && dynamicMetrics.inflationImpact > 5) {
            insights.push({
                title: 'Inflation Vulnerability',
                text: `A 5-year high-inflation shock reduces your survival by ${dynamicMetrics.inflationImpact}%. Your plan is sensitive to purchasing power erosion.`,
                icon: '🔥',
                type: 'negative'
            });
        } else if (dynamicMetrics) {
            insights.push({
                title: 'Inflation Resilience',
                text: `Even under a sustained inflation spike, your survival drops only ${dynamicMetrics.inflationImpact}%. Strong purchasing power protection.`,
                icon: '💎',
                type: 'positive'
            });
        }

        // 3. Sequence Risk
        if (riskGrid.sequenceRisk > 15) {
            insights.push({
                title: 'Sequence-of-Return Risk',
                text: 'Early retirement years are critical. A stress regime at the start could significantly erode your corpus before it recovers.',
                icon: '⚡',
                type: 'negative'
            });
        } else {
            insights.push({
                title: 'Sequence Safety',
                text: 'Your portfolio shows low sensitivity to early market stress regimes, giving you a stable foundation in your first years of retirement.',
                icon: '🌊',
                type: 'positive'
            });
        }

        // 4. Reverse Stress Test
        if (dynamicMetrics) {
            insights.push({
                title: 'Minimum Viable Return',
                text: `Your plan survives as long as markets deliver ≥${dynamicMetrics.minSustainableReturn}% real return. Historically, broad equity has delivered 5–7%.`,
                icon: '📊',
                type: dynamicMetrics.minSustainableReturn < 4 ? 'positive' : 'neutral'
            });
        }

        // 5. Actionable
        if (hero.survivalRate < 85) {
            insights.push({
                title: 'Optimizing Action',
                text: 'Increasing monthly contributions by 10% or delaying retirement by 2 years could materially boost your success probability.',
                icon: '🚀',
                type: 'action'
            });
        } else if (dynamicMetrics) {
            insights.push({
                title: 'Estate Potential',
                text: `With high resilience, your median terminal wealth is ${formatINR(summary.medianFinal)}. Consider legacy planning or lifestyle upgrades.`,
                icon: '🏛️',
                type: 'positive'
            });
        }

        return insights;
    };

    const dynamicInsights = getInsights();

    // Matrix: Use server-driven dynamicMetrics when available
    const dm = dynamicMetrics || {};
    const matrixItems = [
        {
            label: 'Health Score',
            value: dm.healthScore ?? '—',
            unit: '/100',
            score: dm.healthScore ?? 0
        },
        {
            label: 'Inflation Impact',
            value: dm.inflationImpact ?? '—',
            unit: '% drop',
            score: Math.max(0, 100 - (dm.inflationImpact ?? 50) * 5)
        },
        {
            label: 'Income Stability',
            value: dm.incomeVolatility != null ? (100 - dm.incomeVolatility).toFixed(0) : '—',
            unit: 'pts',
            score: dm.incomeVolatility != null ? (100 - dm.incomeVolatility) : 0
        },
        {
            label: 'Min Real Return',
            value: dm.minSustainableReturn ?? '—',
            unit: '%',
            score: dm.minSustainableReturn != null
                ? Math.max(0, 100 - dm.minSustainableReturn * 15)
                : 0
        }
    ];

    const getStatusClass = (score) => {
        if (score >= 80) return 'status-strong';
        if (score >= 50) return 'status-warning';
        return 'status-critical';
    };

    return (
        <motion.div
            className="explainer-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            <div className="explainer-card">
                <p className="explainer-tag">INTELLIGENT COMMENTARY</p>
                <h3 className="explainer-title">Analysis Insights</h3>
                <div className="explainer-divider" />

                <div className="health-matrix">
                    {matrixItems.map((item, id) => (
                        <div key={id} className="matrix-card">
                            <span className="matrix-label">{item.label}</span>
                            <div className="matrix-value-row">
                                <span className="matrix-value">{item.value}</span>
                                <span className="matrix-unit">{item.unit}</span>
                            </div>
                            <div className="matrix-status">
                                <motion.div
                                    className={`status-bar ${getStatusClass(item.score)}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, Math.max(5, item.score))}%` }}
                                    transition={{ duration: 1.5, delay: 1 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="explainer-list">
                    {dynamicInsights.map((item, i) => (
                        <div key={i} className={`explainer-item insight-${item.type}`}>
                            <span className="explainer-icon">{item.icon}</span>
                            <div>
                                <p className="explainer-item-title">{item.title}</p>
                                <p className="explainer-item-text">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="explainer-methodology">
                    <p className="methodology-title">Methodology</p>
                    <p className="methodology-text">
                        Markov Regime-Switching Monte Carlo with Student-t fat tails (ν=5).
                        Returns switch between Growth and Stress regimes with stochastic inflation.
                        {dm.regimeBreakdown && (
                            <> Avg path: <strong>{dm.regimeBreakdown.growthYears}yr</strong> growth, <strong>{dm.regimeBreakdown.stressYears}yr</strong> stress.</>
                        )}
                    </p>
                    <div className="disclaimer-box">
                        <p className="disclaimer-text">
                            * Forward-looking regime probabilities based on historical patterns.
                            Past performance is no guarantee of future results.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AnalysisExplainer;
