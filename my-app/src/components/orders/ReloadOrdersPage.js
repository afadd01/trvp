import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/orders.css';

const ReloadOrdersPage = () => {
    const navigate = useNavigate();
    const [orderDate, setOrderDate] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleReloadOrders = async () => {
        try {
            const response = await axios.post('http://localhost:3001/orders/reload', {
                orderDateCurrent: orderDate
            });

            if (response.data.message === "Date is not valid")
                alert("Выбранная дата меньше текущей");
            else
                navigate('/orders'); // Перенаправление на страницу со списком заказов после обновления
        } catch (error) {
            console.error(error); // Обработка ошибок
        }
    };

    return (
        <div className="orders-container">
            <Link to="/">
                <button className="add-order-btn">
                    Вернуться на главную
                </button>
            </Link>
            <Link to="/orders">
                <button className="add-order-btn">
                    Вернуться к списку заказов
                </button>
            </Link>
            <div className="neworder-form">
                <h2>Отгрузка заказов</h2>
                <input
                    type="date"
                    placeholder="Дата заказа"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />

                <button className="reload-order-btn" onClick={handleReloadOrders}>
                    Подтвердить отгрузку
                </button>
            </div>
        </div>
    );
};

export default ReloadOrdersPage;
