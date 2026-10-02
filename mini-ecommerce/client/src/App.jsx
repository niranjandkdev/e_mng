import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { useCart } from './CartContext.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';

export default function App() {
  const { count } = useCart();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('theme', dark ? 'dark' : 'light'); }, [dark]);
  return (
    <>
      <header className="bar">
        <Link to="/" className="logo">Marketly</Link>
        <nav>
          <button className="ghost" onClick={() => setDark(d => !d)} aria-label="Toggle dark mode">{dark ? 'Light' : 'Dark'}</button>
          <Link to="/cart" className="cartlink">Cart <span className="pill">{count}</span></Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order/:id" element={<OrderSuccess />} />
          <Route path="*" element={<p className="empty">Page not found. <Link to="/">Back to the store</Link></p>} />
        </Routes>
      </main>
    </>
  );
}
