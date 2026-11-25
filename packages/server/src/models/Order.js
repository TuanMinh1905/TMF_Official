import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    size: String,
    qty: Number,
    price: Number,
  }],
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);

