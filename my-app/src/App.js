import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/general/Header';
import LoginPage from './components/account/LoginPage';
import IndexPage from './components/IndexPage';
import RegisterPage from './components/account/RegisterPage';
import ProductsPage from './components/products/ProductsPage';
import ProductIndexPage from './components/products/ProductIndexPage';
import OrdersPage from './components/orders/OrdersPage';
import NewOrderPage from './components/orders/NewOrderPage';
import OrderIndexPage from './components/orders/OrderIndexPage';
import PositionsPage from './components/positions/PositionsPage';
import NewProductPage from './components/products/NewProductPage';
import NewPositionPage from './components/positions/NewPositionPage';
import PositionIndexPage from './components/positions/PositionIndexPage';
import ReloadOrdersPage from './components/orders/ReloadOrdersPage';
import OrderEditPage from './components/orders/OrderEditPage';


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route exact path="/" element={<IndexPage/>} />
          <Route exact path="/login" element={<LoginPage/>} />
          <Route exact path="/register" element={<RegisterPage/>} />
          <Route exact path="/products" element={<ProductsPage/>} />
          <Route exact path="/products/new" element={<NewProductPage/>} />
          <Route exact path="/products/:id" element={<ProductIndexPage/>} />
          <Route exact path="/orders" element={<OrdersPage/>} />
          <Route exact path="/orders/new" element={<NewOrderPage/>} />
          <Route exact path="/orders/reload" element={<ReloadOrdersPage/>} />
          <Route exact path="/orders/edit/:id" element={<OrderEditPage/>} />
          <Route exact path="/orders/:id" element={<OrderIndexPage/>} />
          <Route exact path="/positions" element={<PositionsPage/>} />
          <Route exact path="/positions/new" element={<NewPositionPage/>} />
          <Route exact path="/positions/:id" element={<PositionIndexPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
