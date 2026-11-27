import Order from '../models/Order.js';
import { reportQueue } from '../queues/reportQueue.js';
import { redisConnection } from '../config/redis.js';

// Demo: chay moi 2 phut (Production se chay hang ngay vao cuoi ngay)
const REPORT_INTERVAL_MS = 2 * 60 * 1000;

const cronState = {
  running: false,
  intervalMs: REPORT_INTERVAL_MS,
  lastRunAt: null,
  reportsGenerated: 0,
  lastWarning: null,
};

/**
 * Tong hop bao cao don hang trong ngay va in log co dinh dang.
 */
export async function generateDailyReport() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [summaryAgg, statusAgg, topProductsAgg] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfDay } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [{ $ne: ['$status', 'cancelled'] }, '$totalAmount', 0],
            },
          },
        },
      },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfDay } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfDay }, status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalQty: { $sum: '$items.qty' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
        },
      },
      { $sort: { totalQty: -1, revenue: -1 } },
      { $limit: 5 },
    ]),
  ]);

  const totalOrders = summaryAgg[0]?.totalOrders || 0;
  const totalRevenue = summaryAgg[0]?.totalRevenue || 0;

  const ordersByStatus = { pending: 0, processing: 0, completed: 0, cancelled: 0 };
  for (const row of statusAgg) {
    if (row._id && row._id in ordersByStatus) {
      ordersByStatus[row._id] = row.count;
    }
  }

  const topProducts = topProductsAgg.map((item) => ({
    name: item._id || 'San pham',
    qty: item.totalQty,
    revenue: item.revenue,
  }));

  const dateStr = startOfDay.toLocaleDateString('en-CA');
  const formattedRevenue = new Intl.NumberFormat('vi-VN').format(totalRevenue);
  const topLines =
    topProducts.length > 0
      ? topProducts.map((p, idx) => `  ${idx + 1}. ${p.name} — ${p.qty} sp (${new Intl.NumberFormat('vi-VN').format(p.revenue)}d)`).join('\n')
      : '  (Chua co don hang hom nay)';

  console.log('\n========================================');
  console.log(`[Daily Report] BAO CAO NGAY ${dateStr}`);
  console.log('========================================');
  console.log(`[Daily Report] Tong don hom nay:  ${totalOrders}`);
  console.log(`[Daily Report] Doanh thu hom nay: ${formattedRevenue}d`);
  console.log(
    `[Daily Report] Theo trang thai:   pending=${ordersByStatus.pending}, processing=${ordersByStatus.processing}, completed=${ordersByStatus.completed}, cancelled=${ordersByStatus.cancelled}`,
  );
  console.log(`[Daily Report] Top san pham:\n${topLines}`);
  console.log('========================================\n');

  cronState.reportsGenerated += 1;

  return {
    date: dateStr,
    totalOrders,
    totalRevenue,
    ordersByStatus,
    topProducts,
  };
}

/**
 * Day job tao bao cao vao reportQueue, fallback chay truc tiep neu Redis loi.
 */
export async function triggerDailyReport() {
  cronState.lastRunAt = new Date().toISOString();

  try {
    if (redisConnection.status === 'ready') {
      await reportQueue.add('generate-daily-report', {
        triggeredAt: cronState.lastRunAt,
      });
      cronState.lastWarning = null;
      console.log('[Daily Report] Da day job bao cao vao reportQueue');
      return;
    }

    const msg = `Redis chua san sang (${redisConnection.status}), chay bao cao truc tiep`;
    console.warn(`[Daily Report] ${msg}`);
    cronState.lastWarning = msg;
    await generateDailyReport();
  } catch (err) {
    console.warn(`[Daily Report] Khong the day vao queue (${err.message}), chay truc tiep`);
    cronState.lastWarning = err.message;
    try {
      await generateDailyReport();
    } catch (reportErr) {
      console.error(`[Daily Report] Loi tao bao cao: ${reportErr.message}`);
    }
  }
}

/**
 * Khoi dong cron bao cao hang ngay (demo 2 phut/lan).
 */
export function startDailyReportCron() {
  if (cronState.running) return;
  cronState.running = true;

  console.log('[Daily Report] Khoi dong (chu ky 2 phut)');
  const timer = setInterval(triggerDailyReport, REPORT_INTERVAL_MS);
  return timer;
}

export function getDailyReportCronStatus() {
  return { ...cronState };
}
