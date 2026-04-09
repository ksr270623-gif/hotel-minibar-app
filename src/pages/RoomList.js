import React, { useState } from 'react';

const RoomList = ({ floor, rooms, onSelectRoom }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRooms = rooms
        .filter(room => room.floor === floor)
        .filter(room => room.id.toString().includes(searchTerm));

    return (
        <div className="page-content fade-in">
            <h2 className="page-title">{floor} ЭТАЖ</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Поиск номера..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="room-grid">
                {filteredRooms.map(room => (
                    <div
                        key={room.id}
                        className={`room-box status-${room.status}`}
                        onClick={() => onSelectRoom(room)}
                    >
                        {room.id}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomList;