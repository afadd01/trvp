// LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/register.css';


const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/register', {
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName
        }).then((response) => {
            if (response.data.message === 'User registered successfully') {
                navigate('/');
            }
        }).catch((error) => {
            console.error(error); // Обработка ошибок
        });
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <form onSubmit={handleRegister}>
                    <div className="register-form">
                        <h2>Регистрация</h2>
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
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
                        <button class="register-btn" type="submit">Зарегистрироваться</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
