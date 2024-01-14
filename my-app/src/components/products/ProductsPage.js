import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/products.css';

const ProductsPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
        } else {
            // Получение продуктов при загрузке страницы
            axios.get('http://localhost:3001/products')
                .then((response) => {
                    setProducts(response.data.products);
                })
                .catch((error) => {
                    console.error(error); // Обработка ошибок
                });
        }
    }, [navigate]);

    return (
        <div className="products-container">
            <Link to="/">
                <button className="add-product-btn">
                    Вернуться на главную
                </button>
            </Link>
            <Link to="/products/new">
                <button className="add-product-btn">
                    Добавить товар
                </button>
            </Link>
            {products.length > 0 ? (
                products.map((product, index) => (
                    <div className="product-card" key={index}>
                        <Link to={`/products/${product.id}`}>
                            <h3>{product.name}</h3>
                        </Link>
                        <p>Стоимость: ${product.price}</p>
                        <p>{product.description}</p>
                        <p>{product.balance_count}</p>
                    </div>
                ))
            ) : (
                <h2>Пока не добавлено ни одного товара</h2>
            )}
        </div>
    );
};

export default ProductsPage;
