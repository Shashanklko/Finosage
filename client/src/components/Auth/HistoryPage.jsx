import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './HistoryPage.css';

const HistoryPage = ({ onBack, onOpenAnalysis }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const token = localStorage.getItem('finosage_token');
        if (!token) {
            setError('Please login to view your history');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/history/?token=${token}`);
            const json = await res.json();
            if (res.ok) {
                setHistory(json.history);
            } else {
                setError(json.detail || 'Failed to fetch history');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        const token = localStorage.getItem('finosage_token');
        try {
            const res = await fetch(`/api/history/${id}?token=${token}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setHistory(history.filter(item => item.id !== id));
            }
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const formatDate = (isoStr) => {
        const date = new Date(isoStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="history-page">
            <div className="history-header">
                <button className="history-back" onClick={onBack}>← BACK</button>
                <div className="history-title-group">
                    <p className="history-tag">USER ARCHIVE</p>
                    <h1 className="history-title">Analysis History</h1>
                    <div className="history-divider" />
                </div>
            </div>

            <div className="history-content">
                {loading ? (
                    <div className="history-loading">RETRIEVING ARCHIVES...</div>
                ) : error ? (
                    <div className="history-error">{error}</div>
                ) : history.length === 0 ? (
                    <div className="history-empty">
                        <p>No saved analyses found.</p>
                        <button className="history-empty-btn" onClick={onBack}>START NEW SIMULATION</button>
                    </div>
                ) : (
                    <div className="history-grid">
                        <AnimatePresence>
                            {history.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className="history-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => onOpenAnalysis(item)}
                                >
                                    <div className="card-top">
                                        <span className="card-module">{item.module.toUpperCase()}</span>
                                        <span className="card-date">{formatDate(item.timestamp)}</span>
                                    </div>
                                    <h3 className="card-name">{item.name}</h3>
                                    <div className="card-footer">
                                        <div className="card-preview">
                                            {item.module === 'retirement' && (
                                                <span>{item.data.results.hero.survivalRate}% Success Rate</span>
                                            )}
                                        </div>
                                        <button
                                            className="card-delete"
                                            onClick={(e) => handleDelete(item.id, e)}
                                        >
                                            DELETE
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
