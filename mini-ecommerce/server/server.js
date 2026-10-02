import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import products from './routes/products.js';
import orders from './routes/orders.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use((err, req, res, next) => res.status(err.status || 500).json({ message: err.message || 'Server error' }));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mini_ecommerce')
  .then(() => { console.log('MongoDB connected'); app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)); })
  .catch(e => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
