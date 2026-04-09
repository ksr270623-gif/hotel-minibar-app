import React from 'react';

const Header = ({ user, onLogout, onBack, showBack }) => {
    return (
        <header className="main-header">
            <div className="header-left">
                {showBack && <button onClick={onBack} className="back-btn">←</button>}
                <span className="brand-name">RIXOS</span>
            </div>
            <div className="header-right">
                <span className="user-info">{user.login} ({user.role})</span>
                <button onClick={onLogout} className="logout-btn">Выйти</button>
            </div>
        </header>
    );
};

export default Header;