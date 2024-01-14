import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/newProduct.css'; // Импорт CSS для стилей продуктов

const NewProductPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [balanceCount, setBalanceCount] = useState('');

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/products/new', {
                name,
                price,
                description,
                balance_count: balanceCount // Передаем значение balanceCount с подчеркиванием
            });

            console.log(response.data); // Здесь можно добавить обработку успешного добавления товара
            if (response.data.message == "Product added successfully") {
                navigate('/products'); // Перенаправление на страницу со списком товаров после добавления
            }
        } catch (error) {
            console.error(error); // Обработка ошибок
        }
    };

    return (
        <div className="newproduct-page">
            <Link to="/products">
                <button className="add-product-btn">
                    Вернуться к списку товаров
                </button>
            </Link>
            <form className="newproduct-form" onSubmit={handleAddProduct}>
                <h2>Новый товар</h2>
                <input
                    type="text"
                    placeholder="Название"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Цена"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Описание"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Количество на складе"
                    value={balanceCount}
                    onChange={(e) => setBalanceCount(e.target.value)}
                />
                <button type="submit">Добавить товар</button>
            </form>
        </div>
    );
};

export default NewProductPage;
