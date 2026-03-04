import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import WithdrawalInputForm from './WithdrawalInputForm';
import WithdrawalLoadingScreen from './WithdrawalLoadingScreen';
import WithdrawalSummaryCard from './WithdrawalSummaryCard';
import GuardrailChart from './GuardrailChart';
import StressTestGrid from './StressTestGrid';
import CorpusProjectionChart from './CorpusProjectionChart';
import WithdrawalScheduleTable from './WithdrawalScheduleTable';
import WithdrawalExplainer from './WithdrawalExplainer';
import '../RetirementEngine/RetirementEngine.css';
import './WithdrawalLab.css';

const WithdrawalLabPage = ({ onBack, initialData, backRef, onPhaseChange }) => {
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
            const res = await fetch('/api/withdrawal/stress-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            setResults(json);
        } catch (err) {
            console.error('Withdrawal API error:', err);
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
                    module: 'lab',
                    name: `Withdrawal Strategy`,
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
                    <WithdrawalInputForm key="input" onGenerate={handleGenerate} onBack={onBack} />
                )}
                {phase === 'loading' && (
                    <WithdrawalLoadingScreen key="loader" onComplete={() => setPhase('results')} />
                )}
                {phase === 'results' && results && (
                    <div key="results" className="engine-results-shell">

                        <div style={{ height: '1rem' }} />

                        <div className="engine-results-scroll">
                            <div className="engine-results-layout">
                                <div className="engine-results-main">
                                    <WithdrawalSummaryCard data={results.hero} />
                                    <GuardrailChart data={results.guardrail} />
                                    <StressTestGrid data={results.stressTests} />
                                    <CorpusProjectionChart data={results.corpusProjection} />
                                    <WithdrawalScheduleTable data={results.schedule} />
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
                                    <WithdrawalExplainer />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WithdrawalLabPage;
