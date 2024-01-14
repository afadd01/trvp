// IndexPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/indexPage.css';

const IndexPage = () => {
  return (
    <div className="card-container">
      <div className="card">
        <div className="button-wrapper">
          <Link to="/products">
            <button>Товары</button>
          </Link>
          <Link to="/orders">
            <button>Заказы</button>
          </Link>
          <Link to="/positions">
            <button>Позиции</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
