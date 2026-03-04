import React from 'react';
import { motion } from 'framer-motion';
import { formatINR } from '../../utils/formatCurrency';
import { Target, TrendingDown, Clock, Activity, TrendingUp, Zap } from 'lucide-react';
import './GoalPlanner.css';

const AdvancedGoalInsights = ({ insights }) => {
    if (!insights) return null;

    const {
        shortfallRecovery,
        riskExposure,
        timeCushions,
        efficiencyScore,
        inflationImpact,
        nudge
    } = insights;

    return (
        <div className="advanced-insights-grid">
            {/* 1. Shortfall Recovery */}
            <motion.div
                className="engine-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="card-header">
                    <Target className="card-icon" size={20} />
                    <h3 className="engine-chart-title m-0">Shortfall Recovery</h3>
                </div>
                <p className="card-desc">Required action for 95% success confidence</p>
                {shortfallRecovery.diff > 0 ? (
                    <>
                        <div className="metric-row">
                            <div>
                                <p className="metric-label">Current SIP</p>
                                <p className="metric-value-sm">{formatINR(shortfallRecovery.currentSip)}/mo</p>
                            </div>
                            <div className="direction-arrow">→</div>
                            <div>
                                <p className="metric-label">Target SIP</p>
                                <p className="metric-value highlight">{formatINR(shortfallRecovery.targetSip)}/mo</p>
                            </div>
                        </div>
                        <div className="metric-alert">
                            Gap: +{formatINR(shortfallRecovery.diff)}/mo
                        </div>
                    </>
                ) : (
                    <div className="metric-row" style={{ justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p className="metric-label">Status</p>
                            <p className="metric-value highlight">Fully On Track (≥ 95%)</p>
                            <p className="card-desc" style={{ marginTop: '0.5rem', marginBottom: 0 }}>Your current SIP is optimal.</p>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* 3. Efficiency Score */}
            <motion.div
                className="engine-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <div className="card-header">
                    <Activity className="card-icon" size={20} />
                    <h3 className="engine-chart-title m-0">Capital Efficiency</h3>
                </div>
                <p className="card-desc">Gamified multi-factor allocation score</p>
                <div className="score-container">
                    <div className="score-ring">
                        <span className="score-value">{efficiencyScore.total}</span>
                        <span className="score-max">/100</span>
                    </div>
                    <div className="score-breakdown">
                        <div className="breakdown-item">
                            <span>Allocation</span>
                            <span className="breakdown-val">{efficiencyScore.allocation}</span>
                        </div>
                        <div className="breakdown-item">
                            <span>Risk Opt.</span>
                            <span className="breakdown-val">{efficiencyScore.risk}</span>
                        </div>
                        <div className="breakdown-item">
                            <span>Sequencing</span>
                            <span className="breakdown-val">{efficiencyScore.sequencing}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 4. Risk Exposure */}
            <motion.div
                className="engine-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <div className="card-header">
                    <TrendingDown className="card-icon" size={20} />
                    <h3 className="engine-chart-title m-0">Risk Exposure</h3>
                </div>
                <p className="card-desc">Dynamic glide-path and drawdown profile</p>
                <div className="split-bar">
                    <div className="split-equity" style={{ width: `${riskExposure.equity}%` }}>{riskExposure.equity}% Eq</div>
                    <div className="split-debt" style={{ width: `${riskExposure.debt}%` }}>{riskExposure.debt}% Dt</div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <p className="metric-label">5Y Avg CAGR</p>
                        <p className="metric-value-sm">{riskExposure.avgCagr5Y}%</p>
                    </div>
                    <div>
                        <p className="metric-label">Worst 1Y Drop</p>
                        <p className="metric-value-sm text-red-400">{riskExposure.worst1Y}%</p>
                    </div>
                </div>
            </motion.div>

            {/* 5. Time Cushions */}
            <motion.div
                className="engine-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            >
                <div className="card-header">
                    <Clock className="card-icon" size={20} />
                    <h3 className="engine-chart-title m-0">Time Cushion</h3>
                </div>
                <p className="card-desc">Funding safety buffer per goal</p>
                <div className="cushion-list">
                    {timeCushions.slice(0, 3).map((g, i) => (
                        <div key={i} className="cushion-item">
                            <span className="cushion-name">{g.name}</span>
                            <span className={`cushion-val ${g.cushion < 0 ? 'negative' : 'positive'}`}>
                                {g.cushion > 0 ? '+' : ''}{g.cushion} Yrs
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* 6. Inflation Impact */}
            <motion.div
                className="engine-card col-span-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <div className="card-header">
                    <TrendingUp className="card-icon" size={20} />
                    <h3 className="engine-chart-title m-0">Inflation Impact (Real vs Nominal)</h3>
                </div>
                <p className="card-desc">Projecting future costs at a 6% annual inflation rate</p>
                <div className="inflation-grid">
                    {inflationImpact.map((g, i) => (
                        <div key={i} className="inflation-item">
                            <p className="inf-name">{g.name}</p>
                            <div className="inf-compare">
                                <div>
                                    <p className="inf-label">Today</p>
                                    <p className="inf-val-sm">{formatINR(g.nominal)}</p>
                                </div>
                                <div>
                                    <p className="inf-label">In {g.years} Yrs</p>
                                    <p className="inf-val-danger">{formatINR(g.realCost)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default AdvancedGoalInsights;
