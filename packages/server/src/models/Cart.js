import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  size: String,
  qty: { type: Number, default: 1 },
  price: Number,
  addedAt: { type: Date, default: Date.now },
});

const cartSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  items: [cartItemSchema],
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);

