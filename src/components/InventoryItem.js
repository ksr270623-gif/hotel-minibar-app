import React from 'react';

const InventoryItem = ({ item, onUpdate, onDateChange }) => {
    // Функция для удобного отображения даты (из YYYY-MM-DD в DD.MM.YY)
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year.slice(2)}`;
    };

    return (
        <div className="product-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <div className="product-info">
                    <div className="product-name">{item.name}</div>
                    {/* Теперь это текстовое поле для быстрого ввода */}
                    <input
                        type="text"
                        placeholder="ДД.ММ.ГГ"
                        className="date-input-quick"
                        defaultValue={formatDate(item.expiry)}
                        onBlur={(e) => {
                            // Логика: если ввели 6 цифр (010526), превращаем в дату
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length === 6) {
                                const d = val.slice(0, 2);
                                const m = val.slice(2, 4);
                                const y = '20' + val.slice(4, 6);
                                onDateChange(item.name, `${y}-${m}-${d}`);
                            }
                        }}
                    />
                </div>
            </div>

            <div className="counter-group">
                <button className="count-btn" onClick={() => onUpdate(item.name, -1)}>-</button>
                <span className="count-display">{item.count}</span>
                <button className="count-btn" onClick={() => onUpdate(item.name, 1)}>+</button>
            </div>
        </div>
    );
};

export default InventoryItem;