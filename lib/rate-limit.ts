/**
 * In-memory rate limiter for authentication endpoints
 * Tracks requests by IP address or email to prevent brute force attacks
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
  lastAttempt: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

// In-memory store for rate limit records
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; remaining: number; resetTime: number } {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  
  let record = rateLimitStore.get(identifier);
  
  // Create new record if doesn't exist or window has expired
  if (!record || now > record.resetTime) {
    record = {
      count: 0,
      resetTime: now + mergedConfig.windowMs,
      lastAttempt: now,
    };
    rateLimitStore.set(identifier, record);
  }
  
  // Increment counter
  record.count++;
  record.lastAttempt = now;
  
  const allowed = record.count <= mergedConfig.maxRequests;
  const remaining = Math.max(0, mergedConfig.maxRequests - record.count);
  const resetTime = record.resetTime;
  
  return { allowed, remaining, resetTime };
}

export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Config presets for different endpoints
 */
export const RATE_LIMIT_PRESETS = {
  // Strict limits for login attempts (5 per 15 min)
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 } as RateLimitConfig,
  
  // Registration (3 per hour)
  register: { maxRequests: 3, windowMs: 60 * 60 * 1000 } as RateLimitConfig,
  
  // General API calls (30 per minute)
  api: { maxRequests: 30, windowMs: 60 * 1000 } as RateLimitConfig,
  
  // Password reset (2 per hour)
  passwordReset: { maxRequests: 2, windowMs: 60 * 60 * 1000 } as RateLimitConfig,
};
