import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/Product.js';
dotenv.config();
const img = s => `https://picsum.photos/seed/${s}/600/450`;
const data = [
  ['Wireless Headphones', 2999, 'Electronics', 25, 'Over-ear Bluetooth headphones with 30-hour battery life and deep bass.'],
  ['Mechanical Keyboard', 4499, 'Electronics', 12, 'Hot-swappable switches, RGB backlight and a sturdy aluminium frame.'],
  ['Smart Watch', 5999, 'Electronics', 0, 'Track steps, heart rate and sleep. Water resistant up to 50 m.'],
  ['Portable Speaker', 1799, 'Electronics', 40, 'Pocket-size speaker with 12 hours of clear, loud sound.'],
  ['Cotton T-Shirt', 599, 'Clothing', 100, 'Soft breathable 100% cotton tee in a relaxed everyday fit.'],
  ['Denim Jacket', 2199, 'Clothing', 18, 'Classic mid-wash denim jacket that goes with everything.'],
  ['Running Shoes', 3499, 'Clothing', 30, 'Lightweight cushioned shoes built for daily runs.'],
  ['Wool Beanie', 349, 'Clothing', 60, 'Warm knit beanie for cold mornings.'],
  ['Atomic Habits', 499, 'Books', 50, 'A proven way to build good habits and break bad ones.'],
  ['The Pragmatic Programmer', 899, 'Books', 15, 'Timeless advice for software craftspeople.'],
  ['Deep Work', 549, 'Books', 8, 'Rules for focused success in a distracted world.'],
  ['Ceramic Coffee Mug', 299, 'Home', 75, 'Hand-glazed 350 ml mug. Dishwasher safe.'],
  ['Desk Lamp', 1299, 'Home', 22, 'Adjustable LED lamp with three colour temperatures.'],
  ['Scented Candle Set', 799, 'Home', 5, 'Set of three soy candles: lavender, vanilla and cedar.'],
  ['Yoga Mat', 999, 'Sports', 35, 'Non-slip 6 mm mat with carrying strap.'],
  ['Steel Water Bottle', 649, 'Sports', 90, 'Insulated 750 ml bottle keeps drinks cold for 24 hours.']
].map(([name, price, category, stock, description], i) => ({ name, price, category, stock, description, image: img(name.replace(/\s/g, '') + i), rating: +(3.8 + (i % 12) / 10).toFixed(1) }));

await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mini_ecommerce');
await Product.deleteMany({});
await Product.insertMany(data);
console.log(`Seeded ${data.length} products`);
process.exit(0);
