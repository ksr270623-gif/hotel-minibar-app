import React, { useState } from 'react';

const AdminPanel = ({ rooms, archive, dailyLogs, threshold, setThreshold, users, setUsers }) => {
    const [view, setView] = useState('stats'); // stats, archive, products, users
    const [newUser, setNewUser] = useState({ login: '', pass: '', role: 'staff' });

    // --- ФУНКЦИИ УПРАВЛЕНИЯ ПЕРСОНАЛОМ ---
    const handleAddUser = () => {
        if (!newUser.login || !newUser.pass) return alert("Заполните логин и пароль");
        if (users.find(u => u.login === newUser.login)) return alert("Этот логин уже занят");
        setUsers([...users, newUser]);
        setNewUser({ login: '', pass: '', role: 'staff' });
        alert("Сотрудник успешно добавлен!");
    };

    const handleChangePassword = (login) => {
        const newPass = prompt(`Введите новый пароль для ${login}:`);
        if (newPass && newPass.trim() !== "") {
            setUsers(users.map(u => u.login === login ? { ...u, pass: newPass } : u));
            alert("Пароль изменен!");
        }
    };

    const handleDeleteUser = (login) => {
        if (login === 'admin') return alert("Главного админа нельзя удалить");
        if (window.confirm(`Удалить доступ для ${login}?`)) {
            setUsers(users.filter(u => u.login !== login));
        }
    };

    // --- РАСЧЕТ СТАТИСТИКИ ПО ТОВАРАМ ---
    const getProductStats = () => {
        let stats = {};
        rooms.forEach(room => {
            room.inventory.forEach(item => {
                if (!stats[item.name]) stats[item.name] = { total: 0, expired: 0 };
                stats[item.name].total += item.count;

                // Проверка срока годности
                if (item.expiry && item.expiry !== 'нет' && item.expiry !== '') {
                    const diff = (new Date(item.expiry) - new Date()) / (1000 * 60 * 60 * 24);
                    if (diff < threshold) stats[item.name].expired += 1;
                }
            });
        });
        return stats;
    };

    const productStats = getProductStats();

    return (
        <div className="page-content fade-in">
            <h2 className="page-title">Управление отелем</h2>

            {/* Навигация (вкладки) */}
            <div className="threshold-buttons" style={{ marginBottom: '20px', display: 'flex', overflowX: 'auto', gap: '5px' }}>
                <button className={`t-btn ${view === 'stats' ? 'active' : ''}`} onClick={() => setView('stats')}>LIVE</button>
                <button className={`t-btn ${view === 'products' ? 'active' : ''}`} onClick={() => setView('products')}>ТОВАРЫ</button>
                <button className={`t-btn ${view === 'users' ? 'active' : ''}`} onClick={() => setView('users')}>ПЕРСОНАЛ</button>
                <button className={`t-btn ${view === 'archive' ? 'active' : ''}`} onClick={() => setView('archive')}>АРХИВ</button>
            </div>

            {/* 1. ВКЛАДКА: LIVE (Активность за сегодня) */}
            {view === 'stats' && (
                <div className="fade-in">
                    <div className="admin-stats-grid">
                        <div className="stat-card">
                            <span className="stat-value" style={{color: '#28a745'}}>{rooms.filter(r => r.status === 'checked').length}</span>
                            <span className="stat-label">Проверено</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value" style={{color: '#dc3545'}}>{rooms.filter(r => r.status === 'dnd').length}</span>
                            <span className="stat-label">DND</span>
                        </div>
                    </div>
                    <div className="admin-settings-section">
                        <h3>Действия сегодня</h3>
                        <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                            {dailyLogs.length === 0 ? <p style={{fontSize: '12px', color: '#999'}}>Лента пуста</p> :
                                dailyLogs.map((log, i) => (
                                    <div key={i} style={{fontSize: '12px', padding: '8px 0', borderBottom: '1px solid #eee'}}>
                                        <b>{log.time}</b> | {log.staff} | №{log.roomId} — <span style={{color: log.action === 'DND' ? 'red' : 'green'}}>{log.action}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* 2. ВКЛАДКА: ТОВАРЫ (Статистика расхода и запасов) */}
            {view === 'products' && (
                <div className="admin-settings-section fade-in">
                    <h3>Аналитика продукции</h3>
                    <table style={{ width: '100%', fontSize: '13px', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ color: '#999', borderBottom: '1px solid #eee' }}>
                            <th style={{padding: '10px 0'}}>Товар</th>
                            <th>Расход</th>
                            <th>В номерах</th>
                            <th>Срок ⚠️</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.keys(productStats).map(name => {
                            // Считаем расход из логов (сколько раз поменяли дату у этого товара сегодня)
                            const consumed = dailyLogs.reduce((acc, log) => {
                                const sale = log.sales?.find(s => s.name === name);
                                return acc + (sale ? sale.qty : 0);
                            }, 0);

                            return (
                                <tr key={name} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                    <td style={{ padding: '12px 0' }}>{name}</td>
                                    <td style={{ fontWeight: 'bold', color: consumed > 0 ? 'var(--gold)' : '#ccc' }}>+{consumed}</td>
                                    <td>{productStats[name].total} шт.</td>
                                    <td style={{ color: productStats[name].expired > 0 ? 'red' : '#28a745' }}>{productStats[name].expired}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 3. ВКЛАДКА: ПЕРСОНАЛ (Логины, Пароли, Добавление) */}
            {view === 'users' && (
                <div className="fade-in">
                    <div className="admin-settings-section" style={{background: '#fcf8f0', border: '1px solid #e2d1b3'}}>
                        <h3>+ Новый сотрудник</h3>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                            <input className="search-input" placeholder="Логин" value={newUser.login} onChange={e => setNewUser({...newUser, login: e.target.value})}/>
                            <input className="search-input" placeholder="Пароль" value={newUser.pass} onChange={e => setNewUser({...newUser, pass: e.target.value})}/>
                            <button className="btn-download" onClick={handleAddUser}>СОЗДАТЬ</button>
                        </div>
                    </div>
                    <div className="admin-settings-section">
                        <h3>Активные аккаунты</h3>
                        {users.map((u, i) => (
                            <div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee'}}>
                                <div>
                                    <b>{u.login}</b> <small style={{color: '#999'}}>({u.role})</small>
                                    <div style={{fontSize: '11px', color: 'var(--gold)'}}>Пароль: {u.pass}</div>
                                </div>
                                <div style={{display: 'flex', gap: '10px'}}>
                                    <button onClick={() => handleChangePassword(u.login)} style={{background: 'none', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer'}}>🔑</button>
                                    {u.login !== 'admin' && <button onClick={() => handleDeleteUser(u.login)} style={{color: 'red', background: 'none', border: 'none', cursor: 'pointer'}}>❌</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. ВКЛАДКА: АРХИВ (Прошлые дни) */}
            {view === 'archive' && (
                <div className="admin-settings-section fade-in">
                    <h3>Архив отчетов (00:00)</h3>
                    {archive.length === 0 ? <p style={{fontSize: '12px', color: '#999'}}>В архиве пока нет записей</p> :
                        archive.map((day, i) => (
                            <div key={i} style={{padding: '12px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '8px', borderLeft: '4px solid var(--gold)'}}>
                                <b>{day.date}</b>
                                <div style={{fontSize: '12px', marginTop: '5px'}}>
                                    Проверено: {day.stats.checked} | Отказ/DND: {day.stats.dnd}
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    );
};

export default AdminPanel;