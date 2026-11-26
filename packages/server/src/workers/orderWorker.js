import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { emailQueue } from '../queues/emailQueue.js';
import Order from '../models/Order.js';
import Outbox from '../models/Outbox.js';

// Order Worker — xu ly don hang tu queue "order-processing"
// Flow: pending → processing → completed → day job email
const orderWorker = new Worker(
  'order-processing',
  async (job) => {
    const { orderId } = job.data;
    console.log(`[Order Worker] Bat dau xu ly don: ${orderId}`);

    // 1. Tim order trong MongoDB
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error(`Khong tim thay order: ${orderId}`);
    }

    // 2. Chuyen trang thai: pending → processing
    order.status = 'processing';
    await order.save();
    console.log(`[Order Worker] Don ${order.orderNumber}: pending → processing`);

    // 3. Gia lap xu ly (kiem tra ton kho, validate, ...)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 4. Chuyen trang thai: processing → completed
    order.status = 'completed';
    await order.save();
    console.log(`[Order Worker] Don ${order.orderNumber}: processing → completed`);

    // 5. Day job vao Email Queue
    await emailQueue.add('send-confirmation', {
      orderId: order._id.toString(),
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      items: order.items,
    });
    console.log(`[Order Worker] Da day email job cho don ${order.orderNumber}`);

    // 6. Cap nhat Outbox: pending → sent
    await Outbox.findOneAndUpdate(
      { 'payload.orderId': order._id, status: 'pending' },
      { status: 'sent', processedAt: new Date() },
    );

    return { orderNumber: order.orderNumber, status: 'completed' };
  },
  {
    connection: redisConnection,
    concurrency: 1, // Xu ly 1 job moi luc (dam bao thu tu FIFO)
  },
);

// Event listeners de theo doi trang thai
orderWorker.on('completed', (job, result) => {
  console.log(`[Order Worker] Hoan thanh: ${result.orderNumber}`);
});

orderWorker.on('failed', (job, err) => {
  console.error(`[Order Worker] That bai (lan ${job.attemptsMade}/${job.opts.attempts}): ${err.message}`);
});

export default orderWorker;

