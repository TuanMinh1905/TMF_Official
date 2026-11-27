import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Outbox from '../models/Outbox.js';

/**
 * GET /api/stats/dashboard
 * Tra ve tong quan he thong: so san pham, tong don hang, doanh thu, don theo trang thai, don gan day.
 */
export async function getDashboardStats(_req, res, next) {
  try {
    const [totalProducts, totalOrders, revenueAgg, statusAgg, recentOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('orderNumber customerName customerEmail totalAmount status createdAt items'),
    ]);

    const revenue = revenueAgg[0]?.total || 0;
    const ordersByStatus = {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    };

    for (const row of statusAgg) {
      if (row._id && row._id in ordersByStatus) {
        ordersByStatus[row._id] = row.count;
      }
    }

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        revenue,
        ordersByStatus,
        recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/stats/outbox
 * Tra ve cac ban ghi Outbox duoc nhom theo trang thai (pending, sent, failed).
 */
export async function getOutboxStatus(_req, res, next) {
  try {
    const grouped = await Outbox.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          records: {
            $push: {
              _id: '$_id',
              eventType: '$eventType',
              payload: '$payload',
              status: '$status',
              processedAt: '$processedAt',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
            },
          },
        },
      },
    ]);

    const summary = { pending: 0, sent: 0, failed: 0, total: 0 };
    const byStatus = { pending: [], sent: [], failed: [] };

    for (const group of grouped) {
      if (group._id && group._id in summary) {
        summary[group._id] = group.count;
        summary.total += group.count;
        byStatus[group._id] = group.records;
      }
    }

    res.json({
      success: true,
      data: {
        summary,
        byStatus,
      },
    });
  } catch (err) {
    next(err);
  }
}
