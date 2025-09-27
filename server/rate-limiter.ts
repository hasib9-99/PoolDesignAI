import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private windowMs: number;
  private maxRequests: number;
  private cleanupInterval: NodeJS.Timeout;

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 10) {
    this.windowMs = windowMs; // 15 minutes default
    this.maxRequests = maxRequests; // 10 requests default
    
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    }
  }

  private getKey(req: Request): string {
    // Use IP address as the key
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    return ip;
  }

  public middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.getKey(req);
      const now = Date.now();
      
      // Initialize or reset if window has passed
      if (!this.store[key] || this.store[key].resetTime < now) {
        this.store[key] = {
          count: 0,
          resetTime: now + this.windowMs
        };
      }

      // Increment counter
      this.store[key].count++;

      // Check if limit exceeded
      if (this.store[key].count > this.maxRequests) {
        const resetTime = Math.ceil((this.store[key].resetTime - now) / 1000);
        
        res.status(429).json({
          success: false,
          error: 'Too many requests',
          message: `Rate limit exceeded. Please try again in ${resetTime} seconds.`,
          retryAfter: resetTime
        });
        return;
      }

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': this.maxRequests.toString(),
        'X-RateLimit-Remaining': (this.maxRequests - this.store[key].count).toString(),
        'X-RateLimit-Reset': Math.ceil(this.store[key].resetTime / 1000).toString()
      });

      next();
    };
  }

  public destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Create different rate limiters for different endpoints
export const strictRateLimiter = new RateLimiter(15 * 60 * 1000, 3); // 3 requests per 15 minutes
export const normalRateLimiter = new RateLimiter(15 * 60 * 1000, 10); // 10 requests per 15 minutes
export const lenientRateLimiter = new RateLimiter(15 * 60 * 1000, 30); // 30 requests per 15 minutes

// Specific rate limiter for pool intake form (strict)
export const poolIntakeRateLimiter = new RateLimiter(30 * 60 * 1000, 2); // 2 submissions per 30 minutes

export default RateLimiter;