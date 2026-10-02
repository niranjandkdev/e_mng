import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String, price: Number, qty: Number
  }],
  total: Number,
  status: { type: String, default: 'Placed' }
}, { timestamps: true });
export default mongoose.model('Order', orderSchema);
