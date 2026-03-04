import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import RetirementInputForm from './RetirementInputForm';
import LoadingScreen from './LoadingScreen';
import HeroStatCard from './HeroStatCard';
import ProjectionChart from './ProjectionChart';
import RiskStatGrid from './RiskStatGrid';
import FailureChart from './FailureChart';
import SimulationSummary from './SimulationSummary';
import AnalysisExplainer from './AnalysisExplainer';
import InsightCards from './InsightCards';
import './RetirementEngine.css';

const RetirementResultsPage = ({ onBack, initialData, backRef, onPhaseChange }) => {
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
            const res = await fetch('/api/retirement/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            setResults(json);
        } catch (err) {
            console.error('Retirement API error:', err);
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
                    module: 'retirement',
                    name: `Retirement Plan (${formData.retirementAge} years)`,
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
                    <RetirementInputForm key="input" onGenerate={handleGenerate} onBack={onBack} />
                )}
                {phase === 'loading' && (
                    <LoadingScreen key="loader" onComplete={() => setPhase('results')} />
                )}
                {phase === 'results' && results && (
                    <div key="results" className="engine-results-shell">

                        <div style={{ height: '1rem' }} />

                        <div className="engine-results-scroll">
                            <div className="engine-results-layout">
                                <div className="engine-results-main">
                                    <HeroStatCard data={results.hero} />
                                    <InsightCards dynamicMetrics={results.dynamicMetrics} hero={results.hero} />
                                    <ProjectionChart data={results.projection} startAge={formData.currentAge} />
                                    <RiskStatGrid data={results.riskGrid} summary={results.summary} dynamicMetrics={results.dynamicMetrics} />
                                    <FailureChart data={results.failureDistribution} startAge={formData.retirementAge} />
                                    <SimulationSummary formData={formData} />
                                    <div style={{ height: '3rem' }} />
                                </div>
                                <div className="explainer-panel">
                                    {localStorage.getItem('finosage_token') && (
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
                                    )}
                                    <AnalysisExplainer results={results} formData={formData} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RetirementResultsPage;
