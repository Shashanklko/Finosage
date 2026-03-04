import React from 'react';
import { motion } from 'framer-motion';

const StressTestGrid = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <motion.div
            className="stress-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            {data.map((s, i) => (
                <div key={i} className="stress-card">
                    <span className={`stress-card-tag ${s.tag}`}>
                        {s.tag === 'pass' ? '● PASS' : s.tag === 'warn' ? '▲ CAUTION' : '✕ RISK'}
                    </span>
                    <p className="stress-card-value" style={{
                        color: s.tag === 'pass' ? '#34D399' : s.tag === 'warn' ? '#FCD34D' : '#F87171'
                    }}>
                        {s.survivalRate}
                    </p>
                    <p className="stress-card-label">{s.scenario}</p>
                    <p className="stress-card-detail">{s.detail}</p>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.8rem' }}>
                        <div>
                            <p style={{ fontSize: '0.8rem', fontWeight: 300 }}>{s.medianCorpus}</p>
                            <p style={{ fontSize: '0.45rem', color: '#4B5563', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Median Corpus</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.8rem', fontWeight: 300 }}>{s.depletionAge}</p>
                            <p style={{ fontSize: '0.45rem', color: '#4B5563', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Depletion Age</p>
                        </div>
                    </div>
                </div>
            ))}
        </motion.div>
    );
};

export default StressTestGrid;
