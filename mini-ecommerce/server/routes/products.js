import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
const r = Router();

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/products?search=&category=&sort=price_asc|price_desc&page=1&limit=8
r.get('/', async (req, res, next) => {
  try {
    const { search = '', category = '', sort = '', page = 1, limit = 8 } = req.query;
    const q = {};
    if (search.trim()) q.name = { $regex: esc(search.trim()), $options: 'i' };
    if (category && category !== 'All') q.category = category;
    const sortBy = sort === 'price_asc' ? { price: 1 } : sort === 'price_desc' ? { price: -1 } : { createdAt: -1 };
    const p = Math.max(1, +page), l = Math.min(50, Math.max(1, +limit));
    const [items, total] = await Promise.all([
      Product.find(q).sort(sortBy).skip((p - 1) * l).limit(l),
      Product.countDocuments(q)
    ]);
    res.json({ items, total, page: p, pages: Math.ceil(total / l) });
  } catch (e) { next(e); }
});

r.get('/categories', async (req, res, next) => {
  try { res.json(await Product.distinct('category')); } catch (e) { next(e); }
});

r.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Product not found' });
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    const related = await Product.find({ category: prod.category, _id: { $ne: prod._id } }).limit(4);
    res.json({ product: prod, related });
  } catch (e) { next(e); }
});
export default r;
