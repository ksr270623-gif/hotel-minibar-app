import React from 'react';

const NoteSection = ({ note, onChange }) => {
    return (
        <div style={{ marginTop: '25px', textAlign: 'left' }}>
            <label style={{ fontSize: '12px', color: '#c5a059', fontWeight: '600', letterSpacing: '1px' }}>
                ЗАМЕТКИ ПО НОМЕРУ
            </label>
            <textarea
                className="note-area"
                placeholder="Напишите здесь, если что-то сломано или нужно донести..."
                value={note}
                onChange={(e) => onChange(e.target.value)}
            />
            <p style={{ fontSize: '10px', color: '#999', marginTop: '5px' }}>
                *Заметки обновляются при каждом сохранении статуса.
            </p>
        </div>
    );
};

export default NoteSection;