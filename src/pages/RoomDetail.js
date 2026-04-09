import React, { useState } from 'react';
import InventoryItem from '../components/InventoryItem';

const RoomDetail = ({ room, user, onSave }) => {
    const [items, setItems] = useState(room.inventory);
    const [note, setNote] = useState(room.notes || '');
    const [cleaningDate, setCleaningDate] = useState(room.lastDeepCleaning || '');

    // Функция для отображения даты из формата YYYY-MM-DD в DD.MM.YY
    const formatDateForDisplay = (dateStr) => {
        if (!dateStr || dateStr === '') return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        return `${parts[2]}.${parts[1]}.${parts[0].slice(2)}`;
    };

    // Обработка ввода цифр для даты чистки (маска ДДММГГ)
    const handleCleaningDateBlur = (e) => {
        const val = e.target.value.replace(/\D/g, '');
        if (val.length === 6) {
            const d = val.slice(0, 2);
            const m = val.slice(2, 4);
            const y = '20' + val.slice(4, 6);
            setCleaningDate(`${y}-${m}-${d}`);
        }
    };

    return (
        <div className="page-content fade-in">
            <div className="room-detail-header" style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h1 style={{ margin: 0, fontSize: '28px' }}>№ {room.id}</h1>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '10px', color: '#c5a059', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                            ПОСЛЕДНЯЯ ЧИСТКА:
                        </span>
                        <input
                            type="text"
                            placeholder="ДД.ММ.ГГ"
                            defaultValue={formatDateForDisplay(cleaningDate)}
                            onBlur={handleCleaningDateBlur}
                            className="date-input-quick"
                            style={{ textAlign: 'right', fontSize: '14px', width: '100px' }}
                        />
                    </div>
                </div>
            </div>

            <div className="product-list">
                {items.map((item, idx) => (
                    <InventoryItem
                        key={idx}
                        item={item}
                        onUpdate={(name, delta) => {
                            setItems(items.map(i => i.name === name ? {...i, count: Math.max(0, i.count + delta)} : i));
                        }}
                        onDateChange={(name, newDate) => {
                            setItems(items.map(i => i.name === name ? {...i, expiry: newDate} : i));
                        }}
                    />
                ))}
            </div>

            <div style={{ marginTop: '25px' }}>
                <label style={{ fontSize: '11px', color: '#999', marginBottom: '8px', display: 'block' }}>ЗАМЕТКИ К НОМЕРУ:</label>
                <textarea
                    className="note-area"
                    placeholder="Напишите здесь информацию для коллег..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{ width: '100%', height: '80px', borderRadius: '8px', padding: '10px', border: '1px solid #eee', fontFamily: 'inherit' }}
                />
            </div>

            <div className="action-block" style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                <button
                    className="btn-check"
                    style={{ flex: 2, padding: '18px', background: '#28a745', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600' }}
                    onClick={() => onSave({...room, inventory: items, notes: note, lastDeepCleaning: cleaningDate, status: 'checked'})}
                >
                    СОХРАНИТЬ (ОК)
                </button>
                <button
                    className="btn-dnd"
                    style={{ flex: 1, padding: '18px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600' }}
                    onClick={() => onSave({...room, status: 'dnd', notes: note, lastDeepCleaning: cleaningDate})}
                >
                    DND
                </button>
            </div>
        </div>
    );
};

export default RoomDetail;