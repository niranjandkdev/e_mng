import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { money, placeOrder } from '../api.js';
import { useCart } from '../CartContext.jsx';

export default function Cart() {
  const { items, setQty, remove, clear, total } = useCart();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', address: '' });
  const [busy, setBusy] = useState(false), [err, setErr] = useState('');
  const set = k => e => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const order = await placeOrder({ customer: f, items: items.map(i => ({ id: i._id, qty: i.qty })) });
      clear(); nav('/order/' + order._id);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }

  if (!items.length) return <p className="empty">Your cart is empty. <Link to="/">Find something to buy</Link></p>;
  return (
    <div className="cartpage">
      <section>
        <h1>Your cart</h1>
        {items.map(i => (
          <div className="line" key={i._id}>
            <img src={i.image} alt={i.name} />
            <div className="grow"><Link to={`/product/${i._id}`}>{i.name}</Link><div>{money(i.price)}</div></div>
            <div className="qty">
              <button onClick={() => setQty(i._id, i.qty - 1)} aria-label="Decrease">−</button>
              <span>{i.qty}</span>
              <button onClick={() => setQty(i._id, i.qty + 1)} aria-label="Increase">+</button>
            </div>
            <strong className="lt">{money(i.price * i.qty)}</strong>
            <button className="link" onClick={() => remove(i._id)}>Remove</button>
          </div>
        ))}
      </section>
      <form className="summary" onSubmit={submit}>
        <h2>Checkout</h2>
        <label>Full name<input required value={f.name} onChange={set('name')} /></label>
        <label>Email<input required type="email" value={f.email} onChange={set('email')} /></label>
        <label>Delivery address<textarea required rows="3" value={f.address} onChange={set('address')} /></label>
        <div className="row total"><span>Total</span><strong>{money(total)}</strong></div>
        {err && <p className="error" role="alert">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Placing order…' : 'Place order'}</button>
      </form>
    </div>
  );
}
