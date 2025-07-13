
// Simple in-memory rate limiter for Edge Runtime compatibility
// Note: In production, you'd want to use Redis or similar for persistence

export interface RateLimitOptions {
  windowMs: number // Window size in milliseconds
  max: number // Maximum requests per window
  identifier: string // Identifier for the rate limit (IP, user ID, etc.)
  type: 'ip' | 'user' | 'tenant' | 'endpoint'
  endpoint?: string
  tenantId?: string
}

// In-memory storage for rate limits
const rateStore = new Map<string, { count: number; resetTime: number }[]>()

export class RateLimiter {
  /**
   * Check if request is within rate limit
   */
  static async isAllowed(options: RateLimitOptions): Promise<{
    allowed: boolean
    count: number
    resetTime: Date
    remaining: number
  }> {
    const now = Date.now()
    const windowStart = now - options.windowMs
    const resetTime = new Date(now + options.windowMs)

    // Create unique key for this rate limit
    const key = `${options.type}:${options.identifier}${options.endpoint ? `:${options.endpoint}` : ''}`

    // Clean up old entries
    this.cleanup(windowStart)

    // Get current entries for this key
    const entries = rateStore.get(key) || []
    
    // Filter entries within current window
    const validEntries = entries.filter(entry => entry.resetTime > windowStart)
    
    // Count current requests
    const currentCount = validEntries.length

    // Check if within limit
    const allowed = currentCount < options.max
    
    if (allowed) {
      // Add new entry
      validEntries.push({ count: 1, resetTime: now + options.windowMs })
      rateStore.set(key, validEntries)
    }
    
    const remaining = Math.max(0, options.max - currentCount - (allowed ? 1 : 0))

    return {
      allowed,
      count: currentCount + (allowed ? 1 : 0),
      resetTime,
      remaining
    }
  }

  /**
   * Clean up expired rate limit entries
   */
  static cleanup(beforeTime: number): void {
    for (const [key, entries] of rateStore.entries()) {
      const validEntries = entries.filter(entry => entry.resetTime > beforeTime)
      if (validEntries.length === 0) {
        rateStore.delete(key)
      } else {
        rateStore.set(key, validEntries)
      }
    }
  }

  /**
   * Reset rate limit for identifier
   */
  static async reset(identifier: string, type: string, endpoint?: string, tenantId?: string): Promise<void> {
    const key = `${type}:${identifier}${endpoint ? `:${endpoint}` : ''}`
    rateStore.delete(key)
  }

  /**
   * Get rate limit status
   */
  static async getStatus(identifier: string, type: string, endpoint?: string, tenantId?: string): Promise<{
    count: number
    resetTime: Date
  } | null> {
    const key = `${type}:${identifier}${endpoint ? `:${endpoint}` : ''}`
    const entries = rateStore.get(key) || []
    const now = Date.now()
    const windowStart = now - 60000 // 1 minute default window
    
    const validEntries = entries.filter(entry => entry.resetTime > windowStart)
    const count = validEntries.length
    
    if (count === 0) {
      return null
    }

    return {
      count,
      resetTime: new Date(now + 60000)
    }
  }
}
