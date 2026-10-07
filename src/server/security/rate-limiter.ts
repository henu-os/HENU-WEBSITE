import "server-only";

interface RateLimitRecord {
  timestamps: number[];
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

class MemoryRateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 5, windowMinutes = 15) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMinutes * 60 * 1000;

    // Periodic cleanup of stale entries every 10 minutes
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), 10 * 60 * 1000).unref?.();
    }
  }

  /**
   * Evaluates rate limit for a key (IP or identifier) using a sliding window.
   */
  async check(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let record = this.store.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(key, record);
    }

    // Filter out timestamps outside the sliding window
    record.timestamps = record.timestamps.filter((t) => t > windowStart);

    if (record.timestamps.length >= this.maxRequests) {
      const oldest = record.timestamps[0] ?? now;
      const resetSeconds = Math.ceil((oldest + this.windowMs - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetSeconds: Math.max(1, resetSeconds),
      };
    }

    record.timestamps.push(now);
    return {
      allowed: true,
      remaining: this.maxRequests - record.timestamps.length,
      resetSeconds: Math.ceil(this.windowMs / 1000),
    };
  }

  /**
   * Resets rate limit for a specific key (useful for tests).
   */
  reset(key?: string): void {
    if (key) {
      this.store.delete(key);
    } else {
      this.store.clear();
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [key, record] of this.store.entries()) {
      record.timestamps = record.timestamps.filter((t) => t > windowStart);
      if (record.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
  }
}

export const enquiryRateLimiter = new MemoryRateLimiter(5, 15);
