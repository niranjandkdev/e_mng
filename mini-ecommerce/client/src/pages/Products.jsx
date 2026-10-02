import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCategories, getProducts, money } from '../api.js';
import { useCart } from '../CartContext.jsx';

export function StockTag({ stock }) {
  if (stock === 0) return <span className="tag out">Out of stock</span>;
  if (stock <= 10) return <span className="tag low">Only {stock} left</span>;
  return <span className="tag ok">{stock} in stock</span>;
}

export default function Products() {
  const [params, setParams] = useSearchParams(); // filters live in the URL, so pages are shareable
  const search = params.get('search') || '', category = params.get('category') || 'All', sort = params.get('sort') || '', page = +(params.get('page') || 1);
  const [text, setText] = useState(search);
  const [cats, setCats] = useState([]);
  const [data, setData] = useState({ items: [], pages: 1, total: 0 });
  const [state, setState] = useState('loading');
  const { add } = useCart();

  const update = patch => {
    const next = new URLSearchParams(params);
    Object.entries({ page: 1, ...patch }).forEach(([k, v]) => (v && v !== 'All' && !(k === 'page' && v === 1)) ? next.set(k, v) : next.delete(k));
    setParams(next);
  };

  useEffect(() => { getCategories().then(setCats).catch(() => {}); }, []);
  // debounced search: waits 350ms after typing stops
  useEffect(() => { const t = setTimeout(() => text !== search && update({ search: text }), 350); return () => clearTimeout(t); }, [text]);
  useEffect(() => {
    setState('loading');
    getProducts({ search, category, sort, page, limit: 8 }).then(d => { setData(d); setState('done'); }).catch(e => setState(e.message));
  }, [search, category, sort, page]);

  return (
    <>
      <section className="hero"><h1>Everyday things, well chosen.</h1><p>{data.total} products across {cats.length} categories</p></section>
      <div className="tools">
        <input type="search" placeholder="Search products by name" value={text} onChange={e => setText(e.target.value)} aria-label="Search products" />
        <select value={category} onChange={e => update({ category: e.target.value })} aria-label="Filter by category">
          <option>All</option>{cats.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={e => update({ sort: e.target.value })} aria-label="Sort by price">
          <option value="">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option>
        </select>
      </div>
      <div className="chips">{['All', ...cats].map(c => <button key={c} className={c === category ? 'chip on' : 'chip'} onClick={() => update({ category: c })}>{c}</button>)}</div>

      {state === 'loading' && <div className="grid">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="card skeleton" />)}</div>}
      {state !== 'loading' && state !== 'done' && <p className="empty">Could not load products: {state}. Check that the server and MongoDB are running.</p>}
      {state === 'done' && !data.items.length && <p className="empty">No products match your search. <button className="link" onClick={() => { setText(''); setParams({}); }}>Clear filters</button></p>}
      {state === 'done' && <div className="grid">
        {data.items.map(p => (
          <article className="card" key={p._id}>
            <Link to={`/product/${p._id}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
            <div className="body">
              <span className="cat">{p.category}</span>
              <h3><Link to={`/product/${p._id}`}>{p.name}</Link></h3>
              <div className="row"><strong>{money(p.price)}</strong><StockTag stock={p.stock} /></div>
              <button className="btn" disabled={!p.stock} onClick={() => add(p)}>{p.stock ? 'Add to cart' : 'Unavailable'}</button>
            </div>
          </article>
        ))}
      </div>}
      {data.pages > 1 && <div className="pager">
        <button className="ghost" disabled={page <= 1} onClick={() => update({ page: page - 1 })}>Previous</button>
        <span>Page {data.page} of {data.pages}</span>
        <button className="ghost" disabled={page >= data.pages} onClick={() => update({ page: page + 1 })}>Next</button>
      </div>}
    </>
  );
}
