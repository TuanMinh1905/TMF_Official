import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';

// Queue xu ly don hang — nhan job khi co order moi
export const orderQueue = new Queue('order-processing', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,           // Thu toi da 3 lan neu fail
    backoff: {
      type: 'exponential', // Cho lau hon moi lan retry (1s, 2s, 4s)
      delay: 1000,
    },
    removeOnComplete: 100, // Giu lai 100 job completed gan nhat trong Redis
    removeOnFail: 50,      // Giu lai 50 job failed gan nhat de debug
  },
});

console.log('[Queue] order-processing da san sang');

