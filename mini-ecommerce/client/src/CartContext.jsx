import { createContext, useContext, useEffect, useState, useCallback } from 'react';
const Ctx = createContext();
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; } });
  const [toast, setToast] = useState('');
  useEffect(() => localStorage.setItem('cart', JSON.stringify(items)), [items]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2200); return () => clearTimeout(t); }, [toast]);

  const add = useCallback((p, qty = 1) => {
    setItems(cur => {
      const found = cur.find(i => i._id === p._id);
      if (found) return cur.map(i => i._id === p._id ? { ...i, qty: Math.min(p.stock, i.qty + qty) } : i);
      return [...cur, { _id: p._id, name: p.name, price: p.price, image: p.image, stock: p.stock, qty: Math.min(p.stock, qty) }];
    });
    setToast(`${p.name} added to cart`);
  }, []);
  const setQty = (id, qty) => setItems(cur => cur.map(i => i._id === id ? { ...i, qty: Math.max(1, Math.min(i.stock, qty)) } : i));
  const remove = id => setItems(cur => cur.filter(i => i._id !== id));
  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return <Ctx.Provider value={{ items, add, setQty, remove, clear, count, total }}>
    {children}
    {toast && <div className="toast" role="status">{toast}</div>}
  </Ctx.Provider>;
}
