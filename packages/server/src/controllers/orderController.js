import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Outbox from '../models/Outbox.js';
import { orderQueue } from '../queues/orderQueue.js';

export async function createOrder(req, res, next) {
  try {
    const { sessionId, customerName, customerEmail, customerPhone } = req.body;
    const cart = await Cart.findOne({ sessionId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Gio hang trong' });
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const orderNumber = 'TMF-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const order = await Order.create({
      orderNumber,
      items: cart.items.map((i) => ({
        productId: i.productId,
        name: i.name,
        size: i.size,
        qty: i.qty,
        price: i.price,
      })),
      customerName,
      customerEmail,
      customerPhone,
      totalAmount,
    });

    await Outbox.create({
      eventType: 'ORDER_CREATED',
      payload: { orderId: order._id, orderNumber, customerEmail, totalAmount },
    });

    // Day job vao queue de worker xu ly bat dong bo
    try {
      await orderQueue.add('process-order', { orderId: order._id.toString() });
      console.log(`[API] Da day job vao queue cho don ${orderNumber}`);
    } catch (queueErr) {
      // Neu Redis loi, van tao order thanh cong (Outbox se xu ly lai o Giai doan 3)
      console.warn(`[API] Khong the day job vao queue: ${queueErr.message}`);
    }

    await Cart.findOneAndDelete({ sessionId });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Khong tim thay don hang' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

