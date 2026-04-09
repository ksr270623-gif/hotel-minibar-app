import React from 'react';

const FloorSelection = ({ onSelectFloor, onShowExpiry, onOpenAdmin, role }) => {
    return (
        <div className="page-content">
            <h2 className="page-title">Выберите этаж</h2>
            <div className="floor-grid">
                <button className="floor-card" onClick={() => onSelectFloor(3)}>
                    <span className="floor-number">3</span>
                    <span className="floor-label">Этаж (301-348)</span>
                </button>
                <button className="floor-card" onClick={() => onSelectFloor(4)}>
                    <span className="floor-number">4</span>
                    <span className="floor-label">Этаж (401-471)</span>
                </button>
                <button className="floor-card" onClick={() => onSelectFloor(5)}>
                    <span className="floor-number">5</span>
                    <span className="floor-label">Этаж (501-555)</span>
                </button>
            </div>

            <div className="action-buttons">
                <button className="expiry-btn" onClick={onShowExpiry}>
                    Список просрочки
                </button>

                {role === 'supervisor' && (
                    <button className="admin-access-btn" onClick={onOpenAdmin}>
                        ⚙️ Панель управления
                    </button>
                )}
            </div>
        </div>
    );
};

export default FloorSelection;