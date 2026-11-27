/**
 * Tao in-memory rate limiter theo IP su dung Map.
 * Tu dong don dep cac entry het han dinh ky.
 */
export function createRateLimiter(options = {}) {
  const windowMs = options.windowMs ?? 60000;
  const maxRequests = options.maxRequests ?? 100;
  const clients = new Map();

  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of clients.entries()) {
      if (now > entry.resetTime) {
        clients.delete(ip);
      }
    }
  }, windowMs);

  // Khong giu event loop song khi server dang tat
  cleanupTimer.unref?.();

  return function rateLimiterMiddleware(req, res, next) {
    const now = Date.now();
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    let entry = clients.get(ip);

    if (!entry || now > entry.resetTime) {
      entry = { count: 1, resetTime: now + windowMs };
      clients.set(ip, entry);
    } else {
      entry.count += 1;
    }

    const remaining = Math.max(0, maxRequests - entry.count);
    res.setHeader?.('X-RateLimit-Limit', String(maxRequests));
    res.setHeader?.('X-RateLimit-Remaining', String(remaining));
    res.setHeader?.('X-RateLimit-Reset', String(Math.ceil(entry.resetTime / 1000)));

    if (entry.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too Many Requests - Qua nhieu yeu cau, vui long thu lai sau',
      });
    }

    return next();
  };
}

const defaultLimiter = createRateLimiter();

/**
 * Co the dung truc tiep `app.use(rateLimiter)` hoac goi `app.use(rateLimiter({ windowMs, maxRequests }))`.
 */
export default function rateLimiter(reqOrOptions, res, next) {
  if (typeof res === 'undefined' && typeof next === 'undefined') {
    return createRateLimiter(reqOrOptions);
  }
  return defaultLimiter(reqOrOptions, res, next);
}
