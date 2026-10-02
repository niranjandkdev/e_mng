import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
const r = Router();

// POST /api/orders  { customer:{name,email,address}, items:[{id,qty}] }
r.post('/', async (req, res, next) => {
  const reserved = []; // for rollback if any item is out of stock
  try {
    const { customer, items } = req.body;
    if (!customer?.name || !customer?.email || !customer?.address)
      return res.status(400).json({ message: 'Name, email and address are required' });
    if (!Array.isArray(items) || !items.length)
      return res.status(400).json({ message: 'Your cart is empty' });

    const lines = [];
    for (const it of items) {
      const qty = Math.floor(+it.qty);
      if (!mongoose.isValidObjectId(it.id) || !(qty > 0)) throw Object.assign(new Error('Invalid cart item'), { status: 400 });
      // atomic: only decrement when enough stock remains (prevents overselling)
      const p = await Product.findOneAndUpdate({ _id: it.id, stock: { $gte: qty } }, { $inc: { stock: -qty } }, { new: true });
      if (!p) {
        const existing = await Product.findById(it.id);
        throw Object.assign(new Error(`Not enough stock for "${existing?.name || 'a product'}"`), { status: 409 });
      }
      reserved.push({ id: p._id, qty });
      lines.push({ product: p._id, name: p.name, price: p.price, qty });
    }
    const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const order = await Order.create({ customer, items: lines, total });
    res.status(201).json(order);
  } catch (e) {
    await Promise.all(reserved.map(x => Product.updateOne({ _id: x.id }, { $inc: { stock: x.qty } })));
    next(e);
  }
});

r.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Order not found' });
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ message: 'Order not found' });
    res.json(o);
  } catch (e) { next(e); }
});
export default r;
