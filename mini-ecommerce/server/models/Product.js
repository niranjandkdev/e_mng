import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, index: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  rating: { type: Number, default: 4 }
}, { timestamps: true });
export default mongoose.model('Product', productSchema);
