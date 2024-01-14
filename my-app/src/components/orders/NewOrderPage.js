import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/newOrder.css'; // Импорт CSS для стилей продуктов

const NewOrderPage = () => {
    const navigate = useNavigate();
    const [vendorName, setVendorName] = useState('');
    const [orderDate, setOrderDate] = useState('');

    const handleAddOrder = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/orders/new', {
                vendorName,
                orderDate
            });

            if (response.data.message === "Order added successfully") {
                navigate('/orders'); // Перенаправление на страницу со списком товаров после добавления
            }
            else if (response.data.message === "Order date is not valid")
                alert("Дата заказа не может быть меньше текущей даты!");

        } catch (error) {
            console.error(error); // Обработка ошибок
        }
    };

    return (
        <div className="neworder-page">
            <Link to="/orders">
                <button className="add-order-btn">
                    Вернуться к списку заказов
                </button>
            </Link>
            <form className="neworder-form" onSubmit={handleAddOrder}>
                <h2>Новый заказ</h2>
                <input
                    type="text"
                    placeholder="ФИО заказчика"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Дата заказа"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                />
                <button type="submit">Добавить заказ</button>
            </form>
        </div>
    );
};

export default NewOrderPage;
