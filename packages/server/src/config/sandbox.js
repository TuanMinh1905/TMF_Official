export const isSandbox = process.env.SANDBOX_MODE === 'true';

export const sandboxConfig = {
  readOnly: isSandbox,
  maxRequestsPerMinute: 100,
  allowedOrigins: [process.env.CLIENT_URL || 'http://localhost:3000'],
};

/**
 * Chan cac thao tac ghi (POST/PUT/PATCH/DELETE) khi he thong dang chay o che do Sandbox.
 * Chi cho phep cac request GET doc du lieu.
 */
export function sandboxMiddleware(req, res, next) {
  const active = isSandbox || process.env.SANDBOX_MODE === 'true';
  if (!active) {
    return next();
  }

  if (req.method !== 'GET') {
    return res.status(403).json({
      success: false,
      message: 'Che do Sandbox dang bat: chi cho phep thao tac doc du lieu (GET)',
    });
  }

  return next();
}
