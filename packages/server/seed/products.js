import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import mongoose from 'mongoose';
import Product from '../src/models/Product.js';

const products = [
  {
    name: 'Ao thun Boxy Cotton', type: 'Ao thun', gender: 'Unisex', shape: 'tee',
    color: '#BA8E91', colors: ['#BA8E91', '#f4eee2', '#675247', '#292b30'],
    price: 249000, tag: 'NEW',
    description: 'Ao thun boxy form rong, chat cotton mem, de phoi do hang ngay.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    name: 'Polo Knit Seoul', type: 'Ao thun', gender: 'Unisex', shape: 'polo',
    color: '#AAB59B', colors: ['#AAB59B', '#eae0c4', '#323943', '#adc2da'],
    price: 329000, tag: 'NEW',
    description: 'Ao polo knit mang am huong Seoul, co be classic.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    name: 'Quan suong Daily', type: 'Quan', gender: 'Unisex', shape: 'jeans',
    color: '#9EACC1', colors: ['#9EACC1', '#bca48e', '#343c47', '#e3d9c9'],
    price: 449000, tag: 'BESTSELLER',
    description: 'Quan suong daily fit, de mac, de phoi.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    name: 'Cardigan Soft Knit', type: 'Ao khoac', gender: 'Unisex', shape: 'cardigan',
    color: '#E6D6C3', colors: ['#E6D6C3', '#b3c5d8', '#cfafb9', '#827167'],
    price: 549000, oldPrice: 649000, tag: 'SALE',
    description: 'Cardigan soft knit, dang rong thoai mai.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    name: 'So mi Corduroy Relaxed', type: 'Ao so mi', gender: 'Unisex', shape: 'shirt',
    color: '#AAB59B', colors: ['#AAB59B', '#d4a8b0', '#866759', '#b5b2aa', '#455469'],
    price: 379000, tag: 'NEW',
    description: 'So mi corduroy relaxed fit, chat lieu dang yeu.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    name: 'Quan tay Wide Fit', type: 'Quan', gender: 'Unisex', shape: 'jeans',
    color: '#B7A18D', colors: ['#B7A18D', '#686d76', '#e2d8c9', '#343536'],
    price: 499000, tag: '',
    description: 'Quan tay wide fit, lich su nhung thoai mai.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    name: 'Ao so mi Airy Oxford', type: 'Ao so mi', gender: 'Unisex', shape: 'shirt',
    color: '#9EACC1', colors: ['#9EACC1', '#e5d8e7', '#f3eee3', '#b5c9b7'],
    price: 399000, oldPrice: 499000, tag: 'SALE',
    description: 'Ao so mi oxford nhe nhang, thoang mat.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    name: 'Tui Canvas Weekend', type: 'Phu kien', gender: 'Unisex', shape: 'bag',
    color: '#927262', colors: ['#927262', '#eae0c4', '#536756'],
    price: 199000, tag: '',
    description: 'Tui canvas weekend, rong rai, tien loi.',
    sizes: ['One size'],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tmf');
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Seed thanh cong: 8 san pham');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed that bai:', err.message);
    process.exit(1);
  }
}

seed();

