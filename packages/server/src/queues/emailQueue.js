import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';

// Queue gui email thong bao — nhan job tu Order Worker
export const emailQueue = new Queue('email-notification', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

console.log('[Queue] email-notification da san sang');

