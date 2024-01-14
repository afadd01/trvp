import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/orders.css';

const OrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
        } else {
            // Получение продуктов при загрузке страницы
            axios.get('http://localhost:3001/orders')
                .then((response) => {
                    setOrders(response.data.orders);
                })
                .catch((error) => {
                    console.error(error); // Обработка ошибок
                });
        }
    }, [navigate]);

    return (
        <div className="orders-container">
            <Link to="/">
                <button className="add-order-btn">
                    Вернуться на главную
                </button>
            </Link>
            <Link to="/orders/new">
                <button className="add-order-btn">
                    Новый заказ
                </button>
            </Link>
            {orders.length > 0 && (
                <Link to="/orders/reload">
                    <button className="reload-order-btn">
                        Отгрузить все заказы
                    </button>
                </Link>
            )}
            {orders.length > 0 ? (
                orders.map((order, index) => (
                    <div className="order-card" key={index}>
                        <Link to={`/orders/${order.id}`}>
                            <h3>{order.vendor_name}</h3>
                        </Link>
                        <p>{order.order_date}</p>
                    </div>
                ))
            ) : (
                <h2>Пока не добавлено ни одного заказа</h2>
            )}
        </div>
    );
};

export default OrdersPage;
