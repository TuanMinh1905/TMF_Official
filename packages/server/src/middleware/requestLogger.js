/**
 * Ghi log HTTP request trong moi truong development theo format:
 * [API] METHOD /path STATUS TIMEms
 */
export default function requestLogger(req, res, next) {
  const env = process.env.NODE_ENV || 'development';
  if (env !== 'development') {
    return next();
  }

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const url = req.originalUrl || req.url;
    console.log(`[API] ${req.method} ${url} ${res.statusCode} ${duration}ms`);
  });

  return next();
}
