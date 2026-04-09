import React, { useState } from 'react';

const AdminPanel = ({ rooms, archive, dailyLogs, threshold, setThreshold, users, setUsers }) => {
    const [view, setView] = useState('stats');
    const [newUser, setNewUser] = useState({ login: '', pass: '', role: 'staff' });

    // --- ФУНКЦИЯ ЭКСПОРТА В EXCEL (CSV) ---
    const exportToExcel = () => {
        if (dailyLogs.length === 0) return alert("Нет данных для экспорта за сегодня");

        // Заголовки таблицы
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Vremya;Sotrudnik;Nomer;Deystvie;Prodazhi/Zameny\r\n";

        // Заполнение строками
        dailyLogs.forEach(log => {
            const salesText = log.sales && log.sales.length > 0
                ? log.sales.map(s => `${s.name}(${s.qty})`).join(" ")
                : "-";
            const row = `${log.time};${log.staff};${log.roomId};${log.action};${salesText}`;
            csvContent += row + "\r\n";
        });

        // Создание ссылки для скачивания
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Otchet_Minibar_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAddUser = () => {
        if (!newUser.login || !newUser.pass) return alert("Заполните логин и пароль");
        if (users.find(u => u.login === newUser.login)) return alert("Этот логин уже занят");
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        // Сохраняем сразу, чтобы не потерять
        localStorage.setItem('hotel_users', JSON.stringify(updatedUsers));
        setNewUser({ login: '', pass: '', role: 'staff' });
        alert("Сотрудник успешно добавлен!");
    };

    const handleChangePassword = (login) => {
        const newPass = prompt(`Введите новый пароль для ${login}:`);
        if (newPass && newPass.trim() !== "") {
            const updatedUsers = users.map(u => u.login === login ? { ...u, pass: newPass } : u);
            setUsers(updatedUsers);
            localStorage.setItem('hotel_users', JSON.stringify(updatedUsers));
            alert("Пароль изменен!");
        }
    };

    const handleDeleteUser = (login) => {
        if (login === 'admin') return alert("Главного админа нельзя удалить");
        if (window.confirm(`Удалить доступ для ${login}?`)) {
            const updatedUsers = users.filter(u => u.login !== login);
            setUsers(updatedUsers);
            localStorage.setItem('hotel_users', JSON.stringify(updatedUsers));
        }
    };

    const getProductStats = () => {
        let stats = {};
        rooms.forEach(room => {
            room.inventory.forEach(item => {
                if (!stats[item.name]) stats[item.name] = { total: 0, expired: 0 };
                stats[item.name].total += item.count;
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

            <div className="threshold-buttons" style={{ marginBottom: '20px', display: 'flex', overflowX: 'auto', gap: '5px' }}>
                <button className={`t-btn ${view === 'stats' ? 'active' : ''}`} onClick={() => setView('stats')}>LIVE</button>
                <button className={`t-btn ${view === 'products' ? 'active' : ''}`} onClick={() => setView('products')}>ТОВАРЫ</button>
                <button className={`t-btn ${view === 'users' ? 'active' : ''}`} onClick={() => setView('users')}>ПЕРСОНАЛ</button>
                <button className={`t-btn ${view === 'archive' ? 'active' : ''}`} onClick={() => setView('archive')}>АРХИВ</button>
            </div>

            {view === 'stats' && (
                <div className="fade-in">
                    <button className="btn-save" onClick={exportToExcel} style={{width: '100%', marginBottom: '15px', background: '#28a745'}}>
                        📊 СКАЧАТЬ ОТЧЕТ В EXCEL
                    </button>

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
                        <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                            {dailyLogs.length === 0 ? <p style={{fontSize: '12px', color: '#999'}}>Лента пуста</p> :
                                dailyLogs.map((log, i) => (
                                    <div key={i} style={{fontSize: '12px', padding: '10px 0', borderBottom: '1px solid #eee'}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <b>{log.time} — №{log.roomId}</b>
                                            <span style={{color: log.action === 'DND' ? 'red' : 'green'}}>{log.action}</span>
                                        </div>
                                        <div style={{color: '#666'}}>Сотрудник: {log.staff}</div>
                                        {log.sales && log.sales.length > 0 && (
                                            <div style={{color: 'var(--gold)', fontSize: '11px'}}>Замена: {log.sales.map(s => s.name).join(', ')}</div>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}

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
                                    <button onClick={() => handleChangePassword(u.login)} title="Сменить пароль">🔑</button>
                                    {u.login !== 'admin' && <button onClick={() => handleDeleteUser(u.login)} style={{color: 'red'}}>❌</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'archive' && (
                <div className="admin-settings-section fade-in">
                    <h3>Архив отчетов</h3>
                    {archive.length === 0 ? <p style={{fontSize: '12px', color: '#999'}}>Архив пуст</p> :
                        archive.map((day, i) => (
                            <div key={i} style={{padding: '12px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '8px', borderLeft: '4px solid var(--gold)'}}>
                                <b>{day.date}</b>
                                <div style={{fontSize: '12px', marginTop: '5px'}}>
                                    Проверено: {day.stats?.checked || 0} | DND: {day.stats?.dnd || 0}
                                </div>
                                {day.logs && (
                                    <details style={{marginTop: '5px', fontSize: '11px', color: '#666'}}>
                                        <summary>Посмотреть детализацию (кто заходил)</summary>
                                        {day.logs.map((l, idx) => (
                                            <div key={idx}>{l.time} - №{l.roomId} ({l.staff})</div>
                                        ))}
                                    </details>
                                )}
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    );
};

export default AdminPanel;