// LoginPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/'); // Перенаправление на другую страницу, если есть токен в localStorage
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/login', {
      username: username,
      password: password
    }).then((response) => {
      if (response.data.message === 'Login successful') {
        localStorage.setItem('accessToken', response.data.token);

        navigate('/');
      }
    }).catch((error) => {
      console.error(error); // Обработка ошибок
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <div className="login-form">
            <h2>Вход в систему</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Войти</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
