import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/positions.css';

const PositionsPage = () => {
    const navigate = useNavigate();
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
        } else {
            // Получение продуктов при загрузке страницы
            axios.get('http://localhost:3001/positions')
                .then((response) => {
                    setPositions(response.data.positions);
                })
                .catch((error) => {
                    console.error(error); // Обработка ошибок
                });
        }
    }, [navigate]);

    return (
        <div className="positions-container">
            <Link to="/">
                <button className="add-position-btn">
                    Вернуться на главную
                </button>
            </Link>
            <Link to="/positions/new">
                <button className="add-position-btn">
                    Новая позиция
                </button>
            </Link>
            {positions.length > 0 ? (
                positions.map((position, index) => (
                    <div className="position-card" key={index}>
                        <Link to={`/positions/${position.id}`}>
                            <h3>Позиция №{position.id}</h3>
                        </Link>
                        <p>Заказчик: {position.vendor_name}</p>
                        <p>Товар: {position.name}</p>
                        <p>Количество товара: {position.good_count}</p>
                    </div>
                ))
            ) : (
                <h2>Пока не добавлено ни одной позиции</h2>
            )}
        </div>
    );
};

export default PositionsPage;
