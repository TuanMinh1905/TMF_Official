import Cart from '../models/Cart.js';
import Outbox from '../models/Outbox.js';

// Demo: chay moi 60 giay (Production se chay moi 1-6 gio)
const CHECK_INTERVAL_MS = 60 * 1000;
const DEFAULT_ABANDONED_MINUTES = parseInt(process.env.ABANDONED_CART_MINUTES || '30', 10);

const cronState = {
  running: false,
  intervalMs: CHECK_INTERVAL_MS,
  thresholdMinutes: DEFAULT_ABANDONED_MINUTES,
  lastRunAt: null,
  detectedCount: 0,
  lastWarning: null,
};

let isChecking = false;

/**
 * Quet cac gio hang khong hoat dong qua nguong thoi gian (mac dinh 30 phut)
 * va tao su kien CART_ABANDONED trong Outbox.
 */
export async function checkAbandonedCarts(thresholdMinutes = DEFAULT_ABANDONED_MINUTES) {
  if (isChecking) return;
  isChecking = true;
  cronState.lastRunAt = new Date().toISOString();

  try {
    const cutoff = new Date(Date.now() - thresholdMinutes * 60 * 1000);
    const abandonedCarts = await Cart.find({
      updatedAt: { $lt: cutoff },
      'items.0': { $exists: true },
    });

    for (const cart of abandonedCarts) {
      // Tranh tao trung Outbox cho cung trang thai gio hang da ghi nhan
      const alreadyRecorded = await Outbox.exists({
        eventType: 'CART_ABANDONED',
        'payload.cartId': cart._id,
        createdAt: { $gte: cart.updatedAt },
      });

      if (alreadyRecorded) continue;

      const totalValue = cart.items.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);

      await Outbox.create({
        eventType: 'CART_ABANDONED',
        payload: {
          cartId: cart._id,
          sessionId: cart.sessionId,
          itemCount: cart.items.length,
          totalValue,
          updatedAt: cart.updatedAt,
        },
      });

      cronState.detectedCount += 1;
      console.log(
        `[Abandoned Cart] Phat hien gio hang bo quen — sessionId: ${cart.sessionId}, so san pham: ${cart.items.length}`,
      );
    }

    cronState.lastWarning = null;
  } catch (err) {
    console.warn(`[Abandoned Cart] Loi khi kiem tra gio hang: ${err.message}`);
    cronState.lastWarning = err.message;
  } finally {
    isChecking = false;
  }
}

/**
 * Khoi dong cron kiem tra gio hang bo quen (demo 60 giay/lan).
 */
export function startAbandonedCartCron() {
  if (cronState.running) return;
  cronState.running = true;

  console.log(`[Abandoned Cart] Khoi dong (chu ky 60 giay, nguong ${DEFAULT_ABANDONED_MINUTES} phut)`);
  const timer = setInterval(() => {
    checkAbandonedCarts(DEFAULT_ABANDONED_MINUTES);
  }, CHECK_INTERVAL_MS);
  return timer;
}

export function getAbandonedCartCronStatus() {
  return { ...cronState };
}
