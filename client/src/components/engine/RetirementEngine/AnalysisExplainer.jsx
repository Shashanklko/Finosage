import React from 'react';
import { motion } from 'framer-motion';
import { formatINR } from '../../../utils/formatCurrency';

const AnalysisExplainer = ({ results, formData }) => {
    if (!results || !formData) return null;

    const { hero, riskGrid, summary, dynamicMetrics } = results;

    const getInsights = () => {
        const insights = [];

        // 1. Success Rate Insight
        if (hero.survivalRate >= 90) {
            insights.push({
                title: 'Retirement Success',
                text: `Your plan survived ${hero.survivalRate}% of all market ups and downs, including severe market crashes.`,
                icon: '🛡️',
                type: 'positive'
            });
        } else if (hero.survivalRate >= 70) {
            insights.push({
                title: 'Stability Check',
                text: `With a ${hero.survivalRate}% success rate across market shifts, your plan is solid but sensitive to consecutive bad years.`,
                icon: '⚖️',
                type: 'neutral'
            });
        } else {
            insights.push({
                title: 'Risk Alert',
                text: 'Under difficult market conditions, your plan shows high risk of running out of money. Consider boosting savings or working longer.',
                icon: '⚠️',
                type: 'negative'
            });
        }

        // 2. Inflation Shock
        if (dynamicMetrics && dynamicMetrics.inflationImpact > 5) {
            insights.push({
                title: 'Rising Cost Risk',
                text: `A 5-year period of high costs reduces your success by ${dynamicMetrics.inflationImpact}%. Your plan is sensitive to rising prices.`,
                icon: '🔥',
                type: 'negative'
            });
        } else if (dynamicMetrics) {
            insights.push({
                title: 'Rising Cost Resilience',
                text: `Even with a sustained spike in costs, your success drops only ${dynamicMetrics.inflationImpact}%. Strong protection against rising prices.`,
                icon: '💎',
                type: 'positive'
            });
        }

        // 3. Sequence Risk
        if (riskGrid.sequenceRisk > 15) {
            insights.push({
                title: 'Market Timing Risk',
                text: 'Early retirement years are critical. A bad market at the start could significantly impact your savings before they recover.',
                icon: '⚡',
                type: 'negative'
            });
        } else {
            insights.push({
                title: 'Timing Safety',
                text: 'Your savings show low sensitivity to early market ups and downs, giving you a stable foundation in your first years of retirement.',
                icon: '🌊',
                type: 'positive'
            });
        }

        // 4. Reverse Stress Test
        if (dynamicMetrics) {
            insights.push({
                title: 'Minimum Growth Needed',
                text: `Your plan survives as long as markets grow by ≥${dynamicMetrics.minSustainableReturn}% after inflation. Historically, stocks have grown by 5–7%.`,
                icon: '📊',
                type: dynamicMetrics.minSustainableReturn < 4 ? 'positive' : 'neutral'
            });
        }

        // 5. Actionable
        if (hero.survivalRate < 85) {
            insights.push({
                title: 'Action Steps',
                text: 'Increasing monthly savings by 10% or retiring 2 years later could significantly boost your success rate.',
                icon: '🚀',
                type: 'action'
            });
        } else if (dynamicMetrics) {
            insights.push({
                title: 'Wealth Potential',
                text: `With high resilience, your likely money left over is ${formatINR(summary.medianFinal)}. Consider gift planning or lifestyle upgrades.`,
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
            label: 'Rising Cost Impact',
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
            label: 'Min Growth Needed',
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
                        Advanced Market Simulation with real-world risk factors.
                        Calculations switch between Growth and Stress periods with dynamic inflation.
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
