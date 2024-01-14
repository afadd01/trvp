import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/newPosition.css'; // Импорт CSS для стилей продуктов

const NewPositionPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [orderId, setOrderId] = useState('');
    const [goods, setGoods] = useState([]);
    const [goodId, setGoodId] = useState('');
    const [goodCount, setGoodCount] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/orders')
            .then((response) => {
                setOrders(response.data.orders);
            })
            .catch((error) => {
                console.error(error);
            });

        axios.get('http://localhost:3001/products')
            .then((response) => {
                setGoods(response.data.products);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleAddPosition = async (e) => {
        e.preventDefault();
        try {
            const checkResponse = await axios.post('http://localhost:3001/positions/check_available_good_count', {
                goodId,
                goodCount
            });

            if (checkResponse.data.available) {
                const response = await axios.post('http://localhost:3001/positions/new', {
                    orderId,
                    goodId,
                    goodCount
                });

                console.log(response.data); // Здесь можно добавить обработку успешного добавления товара
                if (response.data.message == "Position added successfully") {
                    navigate('/positions'); // Перенаправление на страницу со списком товаров после добавления
                }
            } else {
                // Обработка недостаточного количества товара на складе
                alert("Недостаточное количество товара на складе");
            }
        } catch (error) {
            console.error(error); // Обработка ошибок
        }
    };

    return (
        <div className="newposition-page">
            <Link to="/positions">
                <button className="add-order-btn">
                    Вернуться к списку позиций
                </button>
            </Link>
            <form className="newposition-form" onSubmit={handleAddPosition}>
                <h2>Новая позиция</h2>
                <select value={orderId} onChange={(e) => setOrderId(e.target.value)}>
                    <option value="">Выберите заказ</option>
                    {orders.map((order) => (
                        <option key={order.id} value={order.id}>Заказ №{order.id} {order.vendor_name}</option>
                    ))}
                </select>
                <select value={goodId} onChange={(e) => setGoodId(e.target.value)}>
                    <option value="">Выберите продукт</option>
                    {goods.map((product) => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Количество товара"
                    value={goodCount}
                    onChange={(e) => setGoodCount(e.target.value)}
                />
                <button type="submit">Добавить позицию</button>
            </form>
        </div>
    );
};

export default NewPositionPage;
