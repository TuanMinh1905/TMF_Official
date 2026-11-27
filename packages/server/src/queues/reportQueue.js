import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';

// Queue tao bao cao hang ngay — nhan job tu Daily Report Cron
export const reportQueue = new Queue('daily-report', {
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

console.log('[Queue] daily-report da san sang');
