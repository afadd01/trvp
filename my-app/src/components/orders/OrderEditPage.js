import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../../styles/orderIndex.css';

const OrderEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Получаем параметр id из URL
    const [order, setOrder] = useState(null); // Здесь хранится один продукт, поэтому изменяем тип на объект или null
    const [vendorName, setVendorName] = useState(null); // Здесь хранится один продукт, поэтому изменяем тип на объект или null
    const [orderDate, setOrderDate] = useState(null); // Здесь хранится один продукт, поэтому изменяем тип на объект или null

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
        } else {
            axios.get(`http://localhost:3001/orders/${id}`) // Используем параметр id для запроса конкретного продукта
                .then((response) => {
                    setOrder(response.data.order); // Обновляем состояние с одним заказом
                    setVendorName(response.data.order.vendor_name);
                    setOrderDate(response.data.order.order_date);
                })
                .catch((error) => {
                    console.error(error); // Обработка ошибок
                });
        }
    }, [id, navigate]);

    const handleEditOrder = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/orders/${id}`,{
            orderId: id, 
            vendorName, 
            orderDate
        }) // Используем параметр id для запроса конкретного продукта
            .then((response) => {
                if (response.data.message === "Order updated successfully")
                    navigate(`/orders/${id}`)
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
            <Link to={`/orders/${id}`}>
                <button className="add-product-btn">
                    Вернуться к заказу
                </button>
            </Link>
            {order ? (
                <div className="orderindex-card">
                    <form className="neworder-form" onSubmit={handleEditOrder}>
                        <h2>Редактирование заказа</h2>
                        <input type="text" value={`${vendorName}`} onChange={(e) => setVendorName(e.target.value)} />
                        <input type="date" value={`${orderDate}`} onChange={(e) => setOrderDate(e.target.value)} />
                        <button type="submit" className="edit-order-btn">
                            Сохранить
                        </button>
                    </form>
                </div>
            ) : (
                <h2>Заказ не найден</h2>
            )}
        </div>
    );
};

export default OrderEditPage;
