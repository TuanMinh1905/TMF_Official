import IORedis from 'ioredis';
import { config } from './env.js';

// Tao connection dung chung cho BullMQ (Queue + Worker)
// BullMQ yeu cau ioredis, KHONG dung node-redis
export const redisConnection = new IORedis(config.redisUrl, {
  maxRetriesPerRequest: null, // BullMQ yeu cau setting nay
});

redisConnection.on('connect', () => {
  console.log('[Redis] Ket noi thanh cong');
});

redisConnection.on('error', (err) => {
  console.error('[Redis] Loi ket noi:', err.message);
});

