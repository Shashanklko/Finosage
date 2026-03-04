import React from 'react';
import { motion } from 'framer-motion';

const explanations = [
    {
        title: 'Optimal Withdrawal Rate',
        text: 'The DP-computed safe withdrawal rate that maximizes spending while maintaining >90% survival probability across all tested scenarios.',
        icon: '◉'
    },
    {
        title: 'Dynamic Guardrails',
        text: 'Upper and lower bounds that auto-adjust withdrawals. When the portfolio outperforms, you can withdraw more (ceiling). When it underperforms, withdrawals decrease (floor).',
        icon: '◈'
    },
    {
        title: 'Corpus Survival Rate',
        text: 'Percentage of simulated paths where the portfolio lasts the full horizon. Tested across multiple stress scenarios to ensure robustness.',
        icon: '◇'
    },
    {
        title: 'Stress Scenarios',
        text: 'Each scenario modifies return/inflation assumptions to test robustness. PASS (>85%), CAUTION (60-85%), RISK (<60%) thresholds apply.',
        icon: '▬'
    },
    {
        title: 'Sequence-of-Return Risk',
        text: 'Early negative returns are more damaging than later ones due to withdrawals depleting a shrinking base. DP pricing accounts for this asymmetry.',
        icon: '△'
    },
    {
        title: 'Depletion Trajectory',
        text: 'Shows how the corpus decays over time under the chosen strategy. The area under the curve represents total available capital.',
        icon: '◎'
    },
    {
        title: 'Withdrawal Schedule',
        text: 'Year-by-year optimal withdrawal amounts with guardrail annotations. "Floor hit" means the strategy reduced to minimum withdrawals to preserve capital.',
        icon: '▥'
    },
    {
        title: 'Backward Induction',
        text: 'DP solves from the terminal state (year 30) backward, computing the optimal withdrawal at each decision node given the state of the portfolio.',
        icon: '∫'
    },
];

const WithdrawalExplainer = () => {
    return (
        <motion.div
            className="explainer-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            <div className="explainer-card">
                <h3 className="explainer-title">Analysis Guide</h3>
                <div className="explainer-divider" />
                <div className="explainer-list">
                    {explanations.map((item, i) => (
                        <div key={i} className="explainer-item">
                            <span className="explainer-icon">{item.icon}</span>
                            <div>
                                <p className="explainer-item-title">{item.title}</p>
                                <p className="explainer-item-text">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default WithdrawalExplainer;
