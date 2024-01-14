import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../../styles/positionIndex.css';

const PositionsIndexPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Получаем параметр id из URL
    const [position, setPosition] = useState(null); // Здесь хранится один продукт, поэтому изменяем тип на объект или null

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
        } else {
            axios.get(`http://localhost:3001/positions/${id}`) // Используем параметр id для запроса конкретного продукта
                .then((response) => {
                    setPosition(response.data.position); // Обновляем состояние с одним заказом
                })
                .catch((error) => {
                    console.error(error); // Обработка ошибок
                });
        }
    }, [id, navigate]);

    const handleDeleteOrder = () => {
        axios.delete(`http://localhost:3001/positions/${id}`) // Используем параметр id для запроса конкретного продукта
            .then((response) => {
                if (response.data.message === "Position deleted successfully")
                    navigate('/positions')
            })
            .catch((error) => {
                console.error(error); // Обработка ошибок
            });
    };

    return (
        <div className="positionindex-container">
            <Link to="/positions">
                <button className="add-position-btn">
                    Вернуться к списку позиций
                </button>
            </Link>
            {position ? (
                <div className="positionindex-card">
                    <h3>Заказ: №{position.order_id} заказчик: {position.vendor_name}</h3>
                    <p>Товар: {position.name}</p>
                    <p>Количество товара: {position.good_count}</p>
                    <button className="delete-position-btn" onClick={handleDeleteOrder}>
                        Удалить позицию
                    </button>
                </div>
            ) : (
                <h2>Позиция не найдена</h2>
            )}
        </div>
    );
};

export default PositionsIndexPage;
