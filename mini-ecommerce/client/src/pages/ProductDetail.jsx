import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProduct, money } from '../api.js';
import { useCart } from '../CartContext.jsx';
import { StockTag } from './Products.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { add } = useCart();
  const [d, setD] = useState(null), [err, setErr] = useState(''), [qty, setQty] = useState(1);
  useEffect(() => { setD(null); setQty(1); getProduct(id).then(setD).catch(e => setErr(e.message)); window.scrollTo(0, 0); }, [id]);

  if (err) return <p className="empty">{err}. <Link to="/">Back to the store</Link></p>;
  if (!d) return <div className="detail"><div className="skeleton big" /></div>;
  const { product: p, related } = d;
  return (
    <>
      <Link to="/" className="back">Back to products</Link>
      <section className="detail">
        <img src={p.image} alt={p.name} />
        <div>
          <span className="cat">{p.category}</span>
          <h1>{p.name}</h1>
          <p className="rating">Rated {p.rating} out of 5</p>
          <p className="price">{money(p.price)}</p>
          <StockTag stock={p.stock} />
          <p className="desc">{p.description}</p>
          {p.stock > 0 && <div className="qty">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
            <span>{qty}</span>
            <button onClick={() => setQty(q => Math.min(p.stock, q + 1))} aria-label="Increase quantity">+</button>
          </div>}
          <div className="actions">
            <button className="btn" disabled={!p.stock} onClick={() => add(p, qty)}>{p.stock ? 'Add to cart' : 'Out of stock'}</button>
            <button className="ghost" disabled={!p.stock} onClick={() => { add(p, qty); nav('/cart'); }}>Buy now</button>
          </div>
        </div>
      </section>
      {related.length > 0 && <>
        <h2 className="sub">More in {p.category}</h2>
        <div className="grid">{related.map(r => (
          <article className="card" key={r._id}>
            <Link to={`/product/${r._id}`}><img src={r.image} alt={r.name} loading="lazy" /></Link>
            <div className="body"><h3><Link to={`/product/${r._id}`}>{r.name}</Link></h3><strong>{money(r.price)}</strong></div>
          </article>))}
        </div>
      </>}
    </>
  );
}
