import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrder, money } from '../api.js';

export default function OrderSuccess() {
  const { id } = useParams();
  const [o, setO] = useState(null), [err, setErr] = useState('');
  useEffect(() => { getOrder(id).then(setO).catch(e => setErr(e.message)); }, [id]);
  if (err) return <p className="empty">{err}</p>;
  if (!o) return <p className="empty">Loading order…</p>;
  return (
    <section className="receipt">
      <h1>Order placed</h1>
      <p>Thanks, {o.customer.name}. Order <code>{o._id}</code> is on its way to {o.customer.address}.</p>
      {o.items.map((i, k) => <div className="row" key={k}><span>{i.qty} × {i.name}</span><span>{money(i.price * i.qty)}</span></div>)}
      <div className="row total"><span>Total paid</span><strong>{money(o.total)}</strong></div>
      <Link className="btn" to="/">Continue shopping</Link>
    </section>
  );
}
