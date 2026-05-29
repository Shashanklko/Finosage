import React from 'react';
import { Sun, Moon } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onBackClick, backLabel, onAuthClick, user, onLogout, onProfileClick, activeTitle, theme, onThemeToggle }) => {
    return (
        <nav className="navbar">
            <div className="logo">
                FINO<span className="gold-text">SAGE</span>
            </div>

            {activeTitle && (
                <div className="nav-center">
                    <span className="nav-active-title">{activeTitle}</span>
                </div>
            )}

            <div className="nav-right">
                <button className="theme-toggle-btn" onClick={onThemeToggle} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
                    {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                </button>

                {onBackClick && (
                    <button className="nav-back" onClick={onBackClick}>
                        ← {backLabel || 'BACK'}
                    </button>
                )}
                {user ? (
                    <div className="nav-auth-group">
                        <button className="nav-profile" onClick={onProfileClick}>
                            PROFILE
                        </button>
                        <button className="nav-auth filled" onClick={onLogout}>
                            LOGOUT
                        </button>
                    </div>
                ) : (
                    onAuthClick && (
                        <button className="nav-auth filled" onClick={onAuthClick}>
                            SIGN IN
                        </button>
                    )
                )}
            </div>
        </nav>
    );
};

export default Navbar;
