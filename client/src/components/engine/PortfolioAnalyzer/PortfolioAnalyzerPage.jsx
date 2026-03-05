import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PortfolioInputForm from './PortfolioInputForm';
import PortfolioLoadingScreen from './PortfolioLoadingScreen';
import PortfolioSummaryCard from './PortfolioSummaryCard';
import EfficientFrontierChart from './EfficientFrontierChart';
import AllocationDonut from './AllocationDonut';
import BehavioralRiskCards from './BehavioralRiskCards';
import MonteCarloPathsChart from './MonteCarloPathsChart';
import CorrelationMatrix from './CorrelationMatrix';
import PortfolioExplainer from './PortfolioExplainer';
import '../RetirementEngine/RetirementEngine.css';
import './PortfolioAnalyzer.css';

const PortfolioAnalyzerPage = ({ onBack, initialData, backRef, onPhaseChange, user, usageCount, onSimulate, onAuthRedirect }) => {
    const [phase, setPhase] = useState(initialData ? 'results' : 'input');
    const [formData, setFormData] = useState(initialData?.formData || null);
    const [results, setResults] = useState(initialData?.results || null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    // When on results, Navbar back → go to form. When on form, Navbar back → go to modules.
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
            const res = await fetch('/api/portfolio/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            setResults(json);
            if (onSimulate) onSimulate();
        } catch (err) {
            console.error('Portfolio API error:', err);
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
                    module: 'analyzer',
                    name: `Portfolio Analysis`,
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
                                <h2>FREE LIMIT REACHED</h2>
                                <p>You've used your 2 free simulations. Please login or sign up to continue using Finosage engines and save your progress.</p>
                                <div className="limit-actions">
                                    <button className="engine-generate-btn" onClick={onAuthRedirect}>LOGIN / SIGNUP</button>
                                    <button className="limit-back-btn" onClick={onBack}>BACK TO DISCOVERY</button>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <PortfolioInputForm key="input" onGenerate={handleGenerate} onBack={onBack} />
                    )
                )}
                {phase === 'loading' && (
                    <PortfolioLoadingScreen key="loader" onComplete={() => setPhase('results')} />
                )}
                {phase === 'results' && results && (
                    <div key="results" className="engine-results-shell">

                        <div style={{ height: '1rem' }} />

                        <div className="engine-results-scroll">
                            <div className="engine-results-layout">
                                <div className="engine-results-main">
                                    <PortfolioSummaryCard data={results.hero} />

                                    <BehavioralRiskCards
                                        metrics={results.behavioralMetrics}
                                        maxDrawdown={results.hero.maxDrawdown}
                                    />

                                    <div className="port-chart-row">
                                        <EfficientFrontierChart data={results.efficientFrontier} />
                                        <AllocationDonut data={results.allocation} />
                                    </div>

                                    <MonteCarloPathsChart data={results.monteCarloPaths} />
                                    <CorrelationMatrix data={results.correlationMatrix} />
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
                                    <PortfolioExplainer />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PortfolioAnalyzerPage;
