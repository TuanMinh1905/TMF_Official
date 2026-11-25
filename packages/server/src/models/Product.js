import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['Ao thun', 'Ao so mi', 'Quan', 'Ao khoac', 'Phu kien'] },
  gender: { type: String, default: 'Unisex' },
  shape: { type: String, required: true, enum: ['tee', 'polo', 'jeans', 'hoodie', 'bag', 'shirt', 'cardigan'] },
  color: { type: String, required: true },
  colors: [String],
  price: { type: Number, required: true },
  oldPrice: Number,
  tag: { type: String, default: '' },
  description: { type: String, default: '' },
  sizes: { type: [String], default: ['S', 'M', 'L', 'XL'] },
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);

