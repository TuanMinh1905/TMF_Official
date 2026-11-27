import mongoose from 'mongoose';
import { redisConnection } from './redis.js';

/**
 * Dang ky xu ly tat he thong an toan khi nhan SIGINT hoac SIGTERM:
 * dung cron intervals, dong HTTP server, Redis va MongoDB.
 */
export function setupGracefulShutdown(server, cronIntervals = []) {
  let isShuttingDown = false;

  async function shutdown(signal) {
    if (isShuttingDown) {
      return;
    }
    isShuttingDown = true;

    console.log(`[Shutdown] Nhan tin hieu ${signal}, bat dau tat he thong...`);

    const forceExitTimer = setTimeout(() => {
      console.error('[Shutdown] Qua thoi gian cho, buoc thoat tien trinh');
      process.exit(1);
    }, 10000);
    forceExitTimer.unref?.();

    if (Array.isArray(cronIntervals)) {
      let stoppedCount = 0;
      for (const interval of cronIntervals) {
        if (interval) {
          clearInterval(interval);
          stoppedCount += 1;
        }
      }
      if (stoppedCount > 0) {
        console.log(`[Shutdown] Da dung ${stoppedCount} cron interval`);
      }
    }

    if (server && typeof server.close === 'function') {
      await new Promise((resolve) => {
        server.close((err) => {
          if (err) {
            console.error('[Shutdown] Loi dong HTTP server:', err.message);
          } else {
            console.log('[Shutdown] Da dong HTTP server');
          }
          resolve();
        });
      });
    }

    try {
      if (redisConnection && redisConnection.status !== 'end') {
        await redisConnection.quit();
        console.log('[Shutdown] Da dong ket noi Redis');
      }
    } catch (err) {
      console.error('[Shutdown] Loi dong ket noi Redis:', err.message);
      redisConnection?.disconnect();
    }

    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log('[Shutdown] Da dong ket noi MongoDB');
      }
    } catch (err) {
      console.error('[Shutdown] Loi dong ket noi MongoDB:', err.message);
    }

    console.log('[Shutdown] Hoan tat tat he thong');
    process.exit(0);
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}
