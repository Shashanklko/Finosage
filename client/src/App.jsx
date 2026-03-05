import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar_Footer/Navbar';
import Footer from './components/Navbar_Footer/Footer';
import AboutModal from './components/UI/AboutModal';
import Hero from './components/Hero/Hero';
import Discovery from './components/Discovery/Discovery';
import AuthPage from './components/Auth/AuthPage';
import ProfilePage from './components/Auth/ProfilePage';
import HistoryPage from './components/Auth/HistoryPage';
import RetirementResultsPage from './components/engine/RetirementEngine/RetirementResultsPage';
import PortfolioAnalyzerPage from './components/engine/PortfolioAnalyzer/PortfolioAnalyzerPage';
import GoalPlannerPage from './components/engine/GoalPlanner/GoalPlannerPage';
import WithdrawalLabPage from './components/engine/WithdrawalLab/WithdrawalLabPage';
import Loader from './components/UI/Loader';
import './styles/theme.css';

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [view, setViewState] = useState(() => sessionStorage.getItem('finosage_view') || 'hero');
    const prevViewRef = React.useRef(view);
    const setView = (v) => { prevViewRef.current = view; sessionStorage.setItem('finosage_view', v); setViewState(v); };
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [activeAnalysis, setActiveAnalysis] = useState(null);
    const [engineInResults, setEngineInResults] = useState(false);
    const [usageCount, setUsageCount] = useState(() => Number(localStorage.getItem('finosage_usage') || 0));
    const engineBackRef = React.useRef(null);

    useEffect(() => {
        // Check local storage for persistent session
        const storedUser = localStorage.getItem('finosage_user');
        const token = localStorage.getItem('finosage_token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // BACKEND KEEP-ALIVE (Render Pulse)
    // Pings the backend health endpoint every 10 minutes to prevent sleeping.
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const keepAlive = setInterval(() => {
            fetch('/api/health').catch(() => {
                // Silently handle errors (backend might be starting up)
            });
        }, 600000); // 10 minutes (Render sleeps after 15m of inactivity)

        return () => clearInterval(keepAlive);
    }, []);

    const incrementUsage = () => {
        if (!user) {
            const newCount = usageCount + 1;
            setUsageCount(newCount);
            localStorage.setItem('finosage_usage', newCount);
        }
    };

    const handleAuthStatus = (userData) => {
        setUser(userData);
        setView('discovery');
    };

    const handleLogout = () => {
        localStorage.removeItem('finosage_token');
        localStorage.removeItem('finosage_user');
        setUser(null);
        setView('hero');
    };

    const handleOpenHistoryItem = (item) => {
        setActiveAnalysis(item);
        setView(item.module);
    };

    const renderView = () => {
        switch (view) {
            case 'hero':
                return <Hero onExplore={() => setView('discovery')} />;
            case 'discovery':
                return <Discovery onBack={() => setView('hero')} onModuleClick={(id) => { setActiveAnalysis(null); setView(id); }} onAuthClick={() => setView('login')} />;
            case 'login':
                return <AuthPage mode="login" onBack={() => setView('discovery')} onSwitch={() => setView('signup')} onAuth={handleAuthStatus} />;
            case 'signup':
                return <AuthPage mode="signup" onBack={() => setView('discovery')} onSwitch={() => setView('login')} onAuth={handleAuthStatus} />;
            case 'retirement':
                return <RetirementResultsPage onBack={() => setView(activeAnalysis ? 'history' : 'discovery')} initialData={activeAnalysis?.data} backRef={engineBackRef} onPhaseChange={setEngineInResults} user={user} usageCount={usageCount} onSimulate={incrementUsage} onAuthRedirect={() => setView('login')} />;
            case 'analyzer':
                return <PortfolioAnalyzerPage onBack={() => setView(activeAnalysis ? 'history' : 'discovery')} initialData={activeAnalysis?.data} backRef={engineBackRef} onPhaseChange={setEngineInResults} user={user} usageCount={usageCount} onSimulate={incrementUsage} onAuthRedirect={() => setView('login')} />;
            case 'planner':
                return <GoalPlannerPage onBack={() => setView(activeAnalysis ? 'history' : 'discovery')} initialData={activeAnalysis?.data} backRef={engineBackRef} onPhaseChange={setEngineInResults} user={user} usageCount={usageCount} onSimulate={incrementUsage} onAuthRedirect={() => setView('login')} />;
            case 'lab':
                return <WithdrawalLabPage onBack={() => setView(activeAnalysis ? 'history' : 'discovery')} initialData={activeAnalysis?.data} backRef={engineBackRef} onPhaseChange={setEngineInResults} user={user} usageCount={usageCount} onSimulate={incrementUsage} onAuthRedirect={() => setView('login')} />;
            case 'profile':
                return <ProfilePage onBack={() => setView(prevViewRef.current || 'discovery')} onHistoryClick={() => setView('history')} />;
            case 'history':
                return <HistoryPage onBack={() => setView('profile')} onOpenAnalysis={handleOpenHistoryItem} />;
            default:
                return <Hero onExplore={() => setView('discovery')} />;
        }
    };

    return (
        <div className="app-container">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <Loader key="loader" onLoadingComplete={() => setIsLoading(false)} />
                ) : (
                    <motion.div
                        key={view}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                    >
                        <Navbar
                            onBackClick={
                                view === 'discovery' ? () => setView('hero') :
                                    view === 'login' || view === 'signup' || view === 'profile' ? () => setView('discovery') :
                                        view === 'retirement' || view === 'analyzer' || view === 'planner' || view === 'lab' ? () => { if (engineBackRef.current) { engineBackRef.current(); } else { setView('discovery'); } } :
                                            view === 'history' ? () => setView('profile') :
                                                null
                            }
                            backLabel={
                                view === 'discovery' ? 'OVERVIEW' :
                                    view === 'login' || view === 'signup' || view === 'profile' ? 'DISCOVERY' :
                                        view === 'retirement' || view === 'analyzer' || view === 'planner' || view === 'lab' ? (engineInResults ? 'RECONFIGURE' : 'MODULES') :
                                            view === 'history' ? 'PROFILE' :
                                                null
                            }
                            onAuthClick={view === 'discovery' && !user ? () => setView('login') : null}
                            user={view !== 'hero' ? user : null}
                            onLogout={handleLogout}
                            onProfileClick={() => setView('profile')}
                            activeTitle={
                                view === 'retirement' ? 'RETIREMENT WEALTH ENGINE' :
                                    view === 'analyzer' ? 'PORTFOLIO ANALYZER' :
                                        view === 'planner' ? 'WEALTH GOAL PLANNER' :
                                            view === 'lab' ? 'WITHDRAWAL STRATEGY LAB' :
                                                null
                            }
                        />
                        <main>{renderView()}</main>

                        {(view === 'discovery' || view === 'retirement' || view === 'analyzer' || view === 'planner' || view === 'lab' || view === 'login' || view === 'signup' || view === 'profile' || view === 'history') && (
                            <Footer
                                onHomeClick={() => setView('hero')}
                                onAboutClick={() => setIsAboutOpen(true)}
                            />
                        )}

                        <AboutModal
                            isOpen={isAboutOpen}
                            onClose={() => setIsAboutOpen(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
