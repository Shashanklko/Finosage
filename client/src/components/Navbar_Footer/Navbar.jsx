import React from 'react';
import './Navbar.css';

const Navbar = ({ onBackClick, backLabel, onAuthClick, user, onLogout, onProfileClick, activeTitle }) => {
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
                        <button className="nav-auth" onClick={onLogout}>
                            LOGOUT
                        </button>
                    </div>
                ) : (
                    onAuthClick && (
                        <button className="nav-auth" onClick={onAuthClick}>
                            SIGN IN
                        </button>
                    )
                )}
            </div>
        </nav>
    );
};

export default Navbar;
