import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../../styles/orderIndex.css';

const OrderIndexPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Получаем параметр id из URL
    const [order, setOrder] = useState(null); // Здесь хранится один продукт, поэтому изменяем тип на объект или null

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
        } else {
            axios.get(`http://localhost:3001/orders/${id}`) // Используем параметр id для запроса конкретного продукта
                .then((response) => {
                    setOrder(response.data.order); // Обновляем состояние с одним заказом
                })
                .catch((error) => {
                    console.error(error); // Обработка ошибок
                });
        }
    }, [id, navigate]);

    const handleDeleteOrder = () => {
        axios.delete(`http://localhost:3001/orders/${id}`) // Используем параметр id для запроса конкретного продукта
            .then((response) => {
                if (response.data.message === "Order deleted successfully")
                    navigate('/orders')
            })
            .catch((error) => {
                console.error(error); // Обработка ошибок
            });
    };

    return (
        <div className="productindex-container">
            <Link to="/orders">
                <button className="add-product-btn">
                    Вернуться к списку заказов
                </button>
            </Link>
            {order ? (
                <div className="orderindex-card">
                    <h3>{order.vendor_name}</h3>
                    <p>{order.order_date}</p>
                    <Link to={`/orders/edit/${order.id}`}>
                        <button className="edit-order-btn">
                            Редактировать заказ
                        </button>
                    </Link>
                    <button className="delete-order-btn" onClick={handleDeleteOrder}>
                        Удалить заказ
                    </button>
                </div>
            ) : (
                <h2>Заказ не найден</h2>
            )}
        </div>
    );
};

export default OrderIndexPage;
