import Outbox from '../models/Outbox.js';
import Order from '../models/Order.js';
import { orderQueue } from '../queues/orderQueue.js';
import { redisConnection } from '../config/redis.js';

const OUTBOX_INTERVAL_MS = 30 * 1000; // Quet moi 30 giay

const cronState = {
  running: false,
  intervalMs: OUTBOX_INTERVAL_MS,
  lastRunAt: null,
  processedCount: 0,
  failedCount: 0,
  lastWarning: null,
};

let isScanning = false;

/**
 * Quet cac ban ghi Outbox co status = 'pending' va xu ly khoi phuc.
 * - ORDER_CREATED: day lai job vao orderQueue neu Redis san sang.
 * - CART_ABANDONED: ghi nhan nhac nho gio hang bo quen.
 */
export async function processOutbox() {
  if (isScanning) return;
  isScanning = true;
  cronState.lastRunAt = new Date().toISOString();

  try {
    const pendingRecords = await Outbox.find({ status: 'pending' }).sort({ createdAt: 1 });
    if (pendingRecords.length === 0) {
      cronState.lastWarning = null;
      return;
    }

    console.log(`[Outbox Processor] Phat hien ${pendingRecords.length} ban ghi pending`);

    for (const record of pendingRecords) {
      try {
        if (record.eventType === 'ORDER_CREATED') {
          if (redisConnection.status !== 'ready') {
            const msg = `Redis chua san sang (${redisConnection.status}), bo qua ORDER_CREATED`;
            console.warn(`[Outbox Processor] ${msg}`);
            cronState.lastWarning = msg;
            continue;
          }

          const orderId = record.payload?.orderId?.toString();
          if (!orderId) {
            throw new Error('Thieu payload.orderId trong ban ghi ORDER_CREATED');
          }

          const order = await Order.findById(orderId);
          if (!order) {
            throw new Error(`Khong tim thay don hang ${orderId}`);
          }

          if (order.status === 'processing') {
            // Order Worker dang xu ly don nay, cho luot quet sau
            continue;
          }

          if (order.status !== 'completed') {
            await orderQueue.add('process-order', { orderId });
            console.log(`[Outbox Processor] Da day lai job cho don ${order.orderNumber} (${orderId})`);
          }

          record.status = 'sent';
          record.processedAt = new Date();
          await record.save();
          cronState.processedCount += 1;
          cronState.lastWarning = null;
          console.log(`[Outbox Processor] Cap nhat Outbox ${record._id} → sent`);
        } else if (record.eventType === 'CART_ABANDONED') {
          const sessionId = record.payload?.sessionId || 'unknown';
          const itemCount = record.payload?.itemCount || 0;
          console.log(`[Outbox Processor] Xu ly CART_ABANDONED — sessionId: ${sessionId} (${itemCount} san pham)`);

          record.status = 'sent';
          record.processedAt = new Date();
          await record.save();
          cronState.processedCount += 1;
          cronState.lastWarning = null;
        } else {
          throw new Error(`EventType khong duoc ho tro: ${record.eventType}`);
        }
      } catch (recordErr) {
        console.error(`[Outbox Processor] Loi xu ly ban ghi ${record._id}: ${recordErr.message}`);
        record.status = 'failed';
        record.processedAt = new Date();
        await record.save();
        cronState.failedCount += 1;
      }
    }
  } catch (err) {
    console.warn(`[Outbox Processor] Loi khi quet Outbox: ${err.message}`);
    cronState.lastWarning = err.message;
  } finally {
    isScanning = false;
  }
}

/**
 * Khoi dong cron quet Outbox moi 30 giay.
 */
export function startOutboxProcessor() {
  if (cronState.running) return;
  cronState.running = true;

  console.log('[Outbox Processor] Khoi dong (chu ky 30 giay)');
  const timer = setInterval(processOutbox, OUTBOX_INTERVAL_MS);
  return timer;
}

export function getOutboxProcessorStatus() {
  return { ...cronState };
}
