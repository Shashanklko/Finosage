import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import GoalInputForm from './GoalInputForm';
import GoalLoadingScreen from './GoalLoadingScreen';
import GoalOverallCard from './GoalOverallCard';
import GoalSuccessGrid from './GoalSuccessGrid';
import GoalTimelineChart from './GoalTimelineChart';
import GoalFundingChart from './GoalFundingChart';
import GoalTradeoffPanel from './GoalTradeoffPanel';
import GoalExplainer from './GoalExplainer';
import AdvancedGoalInsights from './AdvancedGoalInsights';
import '../RetirementEngine/RetirementEngine.css';
import './GoalPlanner.css';

const GoalPlannerPage = ({ onBack, initialData, backRef, onPhaseChange, user, usageCount, onSimulate, onAuthRedirect }) => {
    const [phase, setPhase] = useState(initialData ? 'results' : 'input');
    const [formData, setFormData] = useState(initialData?.formData || null);
    const [results, setResults] = useState(initialData?.results || null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        const inResults = phase === 'results';
        if (onPhaseChange) onPhaseChange(inResults);
        if (backRef) {
            backRef.current = inResults ? () => setPhase('input') : null;
        }
        return () => {
            if (backRef) backRef.current = null;
            if (onPhaseChange) onPhaseChange(false);
        };
    }, [phase, backRef, onPhaseChange]);

    const handleGenerate = async (data) => {
        setFormData(data);
        setPhase('loading');
        setSaveStatus(null);
        try {
            const res = await fetch('/api/goals/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            setResults(json);
            if (onSimulate) onSimulate();
        } catch (err) {
            console.error('Goal API error:', err);
            setResults(null);
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('finosage_token');
        if (!token) return;

        setIsSaving(true);
        setSaveStatus(null);
        try {
            const res = await fetch('/api/history/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    module: 'planner',
                    name: `Goal Plan`,
                    data: { formData, results }
                }),
            });
            if (res.ok) {
                setSaveStatus('success');
            } else {
                setSaveStatus('error');
            }
        } catch (err) {
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="engine-page">
            <AnimatePresence mode="wait">
                {phase === 'input' && (
                    (!user && usageCount >= 2) ? (
                        <div className="engine-usage-limit">
                            <motion.div
                                className="engine-card limit-card"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <h2>Free Limit Reached</h2>
                                <p>You've used your 2 free simulations. Please login or sign up to continue using Finosage engines and save your progress.</p>
                                <div className="limit-actions">
                                    <button className="engine-generate-btn" onClick={onAuthRedirect}>LOGIN / SIGNUP</button>
                                    <button className="engine-back-btn" onClick={onBack} style={{ marginTop: '1rem', width: '100%', background: 'transparent', border: '1px solid #374151', color: '#9CA3AF' }}>BACK TO DISCOVERY</button>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <GoalInputForm key="input" onGenerate={handleGenerate} onBack={onBack} />
                    )
                )}
                {phase === 'loading' && (
                    <GoalLoadingScreen key="loader" onComplete={() => setPhase('results')} />
                )}
                {phase === 'results' && results && (
                    <div key="results" className="engine-results-shell">

                        <div style={{ height: '1rem' }} />

                        <div className="engine-results-scroll">
                            <div className="engine-results-layout">
                                <div className="engine-results-main">
                                    <GoalOverallCard data={results.overall} />
                                    <GoalSuccessGrid data={results.goals} />
                                    <GoalTimelineChart data={results.timeline} />
                                    <GoalFundingChart data={results.fundingData} />
                                    <GoalTradeoffPanel data={results.tradeoff} />
                                    <AdvancedGoalInsights insights={results.insights} />
                                    <div style={{ height: '3rem' }} />
                                </div>
                                <div className="explainer-panel">
                                    {localStorage.getItem('finosage_token') ? (
                                        <button
                                            className={`engine-save-btn sidebar-save ${saveStatus}`}
                                            onClick={handleSave}
                                            disabled={isSaving || saveStatus === 'success'}
                                        >
                                            {isSaving ? 'STORAGE ACTIVE...' :
                                                saveStatus === 'success' ? '✓ ANALYSIS SAVED' :
                                                    saveStatus === 'error' ? '✕ SAVE FAILED' :
                                                        'SAVE ANALYSIS'}
                                        </button>
                                    ) : (
                                        <button
                                            className="engine-save-btn sidebar-save login-to-save"
                                            onClick={onAuthRedirect}
                                        >
                                            LOGIN TO SAVE
                                        </button>
                                    )}
                                    <GoalExplainer />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GoalPlannerPage;
