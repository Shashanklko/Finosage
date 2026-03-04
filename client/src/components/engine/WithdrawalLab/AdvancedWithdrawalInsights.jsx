import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingDown, Zap, Coins, AlertCircle } from 'lucide-react';
import { formatINR } from '../../../utils/formatCurrency';

const AdvancedWithdrawalInsights = ({ insights }) => {
    if (!insights) return null;

    const {
        longevityRisk,
        sequencePenalty,
        purchasingPower,
        estateBuffer,
        erosionValue
    } = insights;

    return (
        <div className="advanced-insights-grid">
            {/* 1. Longevity Risk */}
            <motion.div
                className="engine-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
            >
                <div className="card-header">
                    <Shield className="card-icon" size={20} />
                    <h3 className="engine-chart-title m-0">Lifespan Risk</h3>
                </div>
                <p className="card-desc">Risk of outliving your savings if you live longer than expected</p>
                <div className="score-container">
                    <div className={`score-ring ${longevityRisk > 40 ? 'warning' : ''}`}>
                        <span className="score-value">{longevityRisk}</span>
                        <span className="score-max">/100</span>
                    </div>
                    <div className="score-info">
                        <p className="metric-label">Vulnerability</p>
                        <p className={`metric-value-sm ${longevityRisk > 40 ? 'text-red-400' : 'text-green-400'}`}>
                            {longevityRisk < 20 ? 'Low' : longevityRisk < 50 ? 'Moderate' : 'High'}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* 2. Sequence Penalty */}
            <motion.div
                className="engine-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="card-header">
                    <TrendingDown className="card-icon" size={20} />
                    <h3 className="engine-chart-title m-0">Market Timing Penalty</h3>
                </div>
                <p className="card-desc">Potential loss in spending if a crash hits early in retirement</p>
                <div className="metric-center">
                    <p className="metric-value highlight">{sequencePenalty}</p>
                    <div className="metric-alert">
                        <AlertCircle size={12} /> Real-term reduction
                    </div>
                </div>
            </motion.div>

            {/* 3. Purchasing Power */}
            <motion.div
                className="engine-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <div className="card-header">
                    <Zap className="card-icon" size={20} />
                    <h3 className="engine-chart-title m-0">Cost of Living Impact</h3>
                </div>
                <p className="card-desc">Loss in what you can buy (Year 20 vs today)</p>
                <div className="erosion-bar-container">
                    <div className="erosion-track">
                        <div
                            className="erosion-fill"
                            style={{ width: `${erosionValue}%` }}
                        />
                    </div>
                    <div className="erosion-metrics">
                        <p className="metric-label">Buying Power Loss</p>
                        <p className="metric-value highlight">{purchasingPower}</p>
                    </div>
                </div>
            </motion.div>

            {/* 4. Estate Buffer */}
            <motion.div
                className="engine-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <div className="card-header">
                    <Coins className="card-icon" size={20} />
                    <h3 className="engine-chart-title m-0">Money for Heirs</h3>
                </div>
                <p className="card-desc">Expected amount left for your family (Median)</p>
                <div className="metric-center">
                    <p className="metric-value highlight">{estateBuffer}</p>
                    <p className="card-desc" style={{ marginTop: '0.4rem' }}>Estimated total at the end of the plan</p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdvancedWithdrawalInsights;
