import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import FloorSelection from './pages/FloorSelection';
import RoomList from './pages/RoomList';
import RoomDetail from './pages/RoomDetail';
import AdminPanel from './pages/AdminPanel';
import ExpiryList from './pages/ExpiryList';
import Header from './components/Header';
import { ALL_ROOMS } from './data/roomsData';
import './styles/main.css';
import './styles/inventory.css';

function App() {
    // --- ПОЛЬЗОВАТЕЛИ (С фиксом пароля) ---
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('hotel_users');
        const defaultUsers = [
            { login: 'admin', pass: 'admin777', role: 'supervisor' },
            { login: 'staff1', pass: '0000', role: 'staff' }
        ];

        if (!saved) return defaultUsers;

        const parsed = JSON.parse(saved);
        // Синхронизируем пароль админа из кода с памятью браузера
        const adminIndex = parsed.findIndex(u => u.login === 'admin');
        if (adminIndex !== -1) {
            parsed[adminIndex].pass = 'admin777';
        }
        return parsed;
    });

    const [rooms, setRooms] = useState(() => {
        const saved = localStorage.getItem('hotel_rooms');
        return saved ? JSON.parse(saved) : ALL_ROOMS;
    });

    const [archive, setArchive] = useState(() => {
        const saved = localStorage.getItem('hotel_archive');
        return saved ? JSON.parse(saved) : [];
    });

    const [dailyLogs, setDailyLogs] = useState(() => {
        const saved = localStorage.getItem('hotel_logs');
        return saved ? JSON.parse(saved) : [];
    });

    const [user, setUser] = useState(null);
    const [screen, setScreen] = useState('login');
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [expiryThreshold, setExpiryThreshold] = useState(90);

    // --- АВТО-СОХРАНЕНИЕ ---
    useEffect(() => {
        localStorage.setItem('hotel_users', JSON.stringify(users));
        localStorage.setItem('hotel_rooms', JSON.stringify(rooms));
        localStorage.setItem('hotel_archive', JSON.stringify(archive));
        localStorage.setItem('hotel_logs', JSON.stringify(dailyLogs));
    }, [users, rooms, archive, dailyLogs]);

    // --- УЛУЧШЕННАЯ ЛОГИКА АРХИВА (00:00) ---
    useEffect(() => {
        const checkMidnight = () => {
            const lastActiveDate = localStorage.getItem('last_active_date');
            const today = new Date().toLocaleDateString();

            if (lastActiveDate && lastActiveDate !== today) {
                const dailyReport = {
                    date: lastActiveDate,
                    stats: {
                        checked: rooms.filter(r => r.status === 'checked').length,
                        dnd: rooms.filter(r => r.status === 'dnd').length
                    },
                    logs: [...dailyLogs] // СОХРАНЯЕМ ДЕТАЛИЗАЦИЮ В АРХИВ
                };
                setArchive(prev => [dailyReport, ...prev]);
                // Сбрасываем только статус, оставляя инвентарь и важные заметки
                setRooms(rooms.map(r => ({ ...r, status: 'unchecked' })));
                setDailyLogs([]);
            }
            localStorage.setItem('last_active_date', today);
        };
        checkMidnight();
    }, [rooms, dailyLogs]);

    // --- ОБРАБОТЧИКИ ---
    const handleSaveRoom = (updatedRoom) => {
        const oldRoom = rooms.find(r => r.id === updatedRoom.id);
        let newSales = [];

        updatedRoom.inventory.forEach((newItem, i) => {
            // Если дата изменилась — это продажа/замена
            if (newItem.expiry !== oldRoom.inventory[i].expiry && newItem.expiry !== '') {
                newSales.push({ name: newItem.name, qty: 1 });
            }
        });

        const newLog = {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            staff: user.login,
            roomId: updatedRoom.id,
            action: updatedRoom.status === 'checked' ? 'Проверка' : 'DND',
            sales: newSales
        };

        setDailyLogs([newLog, ...dailyLogs]);
        setRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
        setScreen('rooms');
    };

    const handleLogout = () => {
        setUser(null);
        setScreen('login');
    };

    if (!user) {
        return <Login users={users} onLogin={(userData) => { setUser(userData); setScreen('floors'); }} />;
    }

    return (
        <div className="app-container">
            <Header
                user={user}
                onLogout={handleLogout}
                onBack={() => setScreen(screen === 'detail' ? 'rooms' : 'floors')}
                showBack={screen !== 'floors'}
            />

            {screen === 'floors' && (
                <FloorSelection
                    onSelectFloor={(floor) => { setSelectedFloor(floor); setScreen('rooms'); }}
                    onShowExpiry={() => setScreen('expiry')}
                    onOpenAdmin={() => setScreen('admin')}
                    role={user.role}
                />
            )}

            {screen === 'rooms' && (
                <RoomList
                    floor={selectedFloor}
                    rooms={rooms}
                    onSelectRoom={(room) => { setSelectedRoom(room); setScreen('detail'); }}
                />
            )}

            {screen === 'detail' && (
                <RoomDetail
                    room={selectedRoom}
                    user={user}
                    onSave={handleSaveRoom}
                />
            )}

            {screen === 'admin' && (
                <AdminPanel
                    rooms={rooms}
                    archive={archive}
                    dailyLogs={dailyLogs}
                    threshold={expiryThreshold}
                    setThreshold={setExpiryThreshold}
                    users={users}
                    setUsers={setUsers}
                />
            )}

            {screen === 'expiry' && (
                <ExpiryList rooms={rooms} threshold={expiryThreshold} />
            )}
        </div>
    );
}

export default App;