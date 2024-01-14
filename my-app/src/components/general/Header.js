import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/header.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const token = localStorage.getItem('accessToken');

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Складской учет 2.0</Link>
      </div>
      <div className="navbar-links">
        {token ? (
          <button type="button" onClick={handleLogout}>
            Выйти
          </button>
        ) : (
          <>
            <Link to="/login">Войти</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
