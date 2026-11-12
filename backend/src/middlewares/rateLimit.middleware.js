/**
 * Zero-dependency, production-grade in-memory rate limiting middleware.
 * Implements sliding window counters, standard headers, and automatic cleanup.
 */
export function createRateLimiter({
  windowMs = 60 * 1000,
  max = 60,
  message = "Too many requests. Please try again later.",
  keyGenerator = null,
} = {}) {
  const hits = new Map();

  // Periodic cleanup of expired windows every minute
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (record.resetTime <= now) {
        hits.delete(key);
      }
    }
  }, Math.min(windowMs, 60000));

  cleanupInterval.unref?.();

  return (req, res, next) => {
    // Generate unique client key (client IP or custom key)
    const clientKey = keyGenerator
      ? keyGenerator(req)
      : (req.ip ||
         req.headers["x-forwarded-for"]?.split(",")?.[0]?.trim() ||
         req.socket?.remoteAddress ||
         "anonymous");

    const now = Date.now();
    const record = hits.get(clientKey);

    if (!record || record.resetTime <= now) {
      hits.set(clientKey, { count: 1, resetTime: now + windowMs });
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", Math.max(0, max - 1));
      res.setHeader("X-RateLimit-Reset", Math.ceil((now + windowMs) / 1000));
      return next();
    }

    if (record.count >= max) {
      const retryAfterSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
      res.setHeader("Retry-After", retryAfterSeconds);
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", 0);
      res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000));
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds,
      });
    }

    record.count += 1;
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - record.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000));
    next();
  };
}

/**
 * Strict limiter for sensitive authentication actions (Login, Registration, Refresh)
 * Max 15 attempts per 15-minute window per IP.
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: "Too many authentication attempts. Please try again after 15 minutes.",
});

/**
 * Throttler for AI Assistant and expensive LLM / Transcription operations
 * Max 30 queries per minute per user/IP.
 */
export const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: "AI request rate limit reached. Please wait a moment before sending another prompt.",
  keyGenerator: (req) => req.user?.id || req.ip || "global-ai",
});

/**
 * General API limiter to prevent denial-of-service traffic spikes
 * Max 200 requests per minute per IP.
 */
export const generalRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 200,
  message: "Too many requests to MeetMind API. Please slow down.",
});
