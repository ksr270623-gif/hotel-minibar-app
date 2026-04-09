import React, { useState } from 'react';
import { USERS } from '../data/users';

const Login = ({ onLogin }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const foundUser = USERS.find(u => u.login === login && u.password === password);
        if (foundUser) {
            onLogin(foundUser);
        } else {
            setError('Ошибка: Неверный логин или пароль');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Система Мини-баров</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Имя персонала / Супервайзер"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p style={styles.error}>{error}</p>}
                    <button type="submit" style={styles.button}>Войти</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
    card: { padding: '40px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', width: '320px' },
    input: { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' },
    error: { color: 'red', fontSize: '14px' }
};

export default Login;