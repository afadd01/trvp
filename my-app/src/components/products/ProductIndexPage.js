import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../../styles/productIndex.css';

const ProductIndexPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Получаем параметр id из URL
    const [product, setProduct] = useState(null); // Здесь хранится один продукт, поэтому изменяем тип на объект или null

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
        } else {
            axios.get(`http://localhost:3001/products/${id}`) // Используем параметр id для запроса конкретного продукта
                .then((response) => {
                    setProduct(response.data.product); // Обновляем состояние с одним продуктом
                })
                .catch((error) => {
                    console.error(error); // Обработка ошибок
                });
        }
    }, [id, navigate]);

    const handleDeleteProduct = () => {
        axios.delete(`http://localhost:3001/products/${id}`) // Используем параметр id для запроса конкретного продукта
            .then((response) => {
                if (response.data.message === "Product deleted successfully")
                    navigate('/products')
            })
            .catch((error) => {
                console.error(error); // Обработка ошибок
            });
    };

    return (
        <div className="productindex-container">
            <Link to="/products">
                <button className="add-product-btn">
                    Вернуться к списку товаров
                </button>
            </Link>
            {product ? (
                <div className="productindex-card">
                    <h3>{product.name}</h3>
                    <p>Стоимость: ${product.price}</p>
                    <p>{product.description}</p>
                    <p>{product.balance_count}</p>
                    <button className="delete-product-btn" onClick={handleDeleteProduct}>
                        Удалить товар
                    </button>
                </div>
            ) : (
                <h2>Продукт не найден</h2>
            )}
        </div>
    );
};

export default ProductIndexPage;
