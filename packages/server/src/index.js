import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { isSandbox, sandboxMiddleware } from './config/sandbox.js';
import { setupGracefulShutdown } from './config/shutdown.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';
import rateLimiter from './middleware/rateLimiter.js';
import { startOutboxProcessor, getOutboxProcessorStatus } from './crons/outboxProcessor.js';
import { startAbandonedCartCron, getAbandonedCartCronStatus } from './crons/abandonedCartCron.js';
import { startDailyReportCron, getDailyReportCronStatus } from './crons/dailyReportCron.js';

// Import workers — chay cung process voi API server
import './workers/orderWorker.js';
import './workers/emailWorker.js';
import './workers/reportWorker.js';

const app = express();

app.use(cors({ origin: config.clientUrl }));
app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);
app.use(sandboxMiddleware);

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'TMF API hoat dong',
    sandbox: isSandbox,
    crons: {
      outboxProcessor: getOutboxProcessorStatus(),
      abandonedCart: getAbandonedCartCronStatus(),
      dailyReport: getDailyReportCronStatus(),
    },
  });
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);

app.use(errorHandler);

connectDB().then(() => {
  const cronIntervals = [
    startOutboxProcessor(),
    startAbandonedCartCron(),
    startDailyReportCron(),
  ];

  const server = app.listen(config.port, () => {
    console.log(`TMF Server chay tai port ${config.port}`);
    console.log('[Workers] Order Worker + Email Worker + Report Worker dang chay');
    console.log('[Crons] Outbox Processor + Abandoned Cart + Daily Report dang chay');
    if (isSandbox) {
      console.log('[Sandbox] Che do Sandbox dang bat (chi cho phep GET)');
    }
  });

  setupGracefulShutdown(server, cronIntervals);
});
