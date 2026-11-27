import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { generateDailyReport } from '../crons/dailyReportCron.js';

// Report Worker — xu ly job bao cao hang ngay tu queue "daily-report"
const reportWorker = new Worker(
  'daily-report',
  async (job) => {
    console.log(`[Report Worker] Bat dau tao bao cao (job ${job.id})`);
    const report = await generateDailyReport();
    return report;
  },
  {
    connection: redisConnection,
    concurrency: 1,
  },
);

reportWorker.on('completed', (job, result) => {
  console.log(`[Report Worker] Hoan thanh bao cao ngay ${result.date} (${result.totalOrders} don)`);
});

reportWorker.on('failed', (job, err) => {
  console.error(`[Report Worker] That bai (lan ${job?.attemptsMade}): ${err.message}`);
});

export default reportWorker;
