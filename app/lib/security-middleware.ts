
import { NextRequest, NextResponse } from 'next/server'
import { RateLimiter } from './rate-limiter'
import { prisma } from './db'

export class SecurityMiddleware {
  /**
   * Rate limiting middleware
   */
  static async rateLimit(request: NextRequest, options: {
    windowMs: number
    max: number
    skipSuccessfulRequests?: boolean
  }): Promise<NextResponse | null> {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const tenantId = request.headers.get('x-tenant-id') || undefined
    const pathname = request.nextUrl.pathname

    const result = await RateLimiter.isAllowed({
      identifier: ip,
      type: 'ip',
      endpoint: pathname,
      tenantId,
      windowMs: options.windowMs,
      max: options.max
    })

    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', resetTime: result.resetTime },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': options.max.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toISOString(),
            'Retry-After': Math.ceil((result.resetTime.getTime() - Date.now()) / 1000).toString()
          }
        }
      )
    }

    return null
  }

  /**
   * CSRF protection middleware
   */
  static async csrfProtection(request: NextRequest): Promise<NextResponse | null> {
    const method = request.method
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')

    // Skip CSRF for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return null
    }

    // Check origin header
    if (!origin) {
      return NextResponse.json(
        { error: 'Missing origin header' },
        { status: 403 }
      )
    }

    // Validate origin against allowed origins
    const allowedOrigins = [
      process.env.NEXTAUTH_URL,
      process.env.NEXT_PUBLIC_APP_URL,
      'http://localhost:3000',
      'https://localhost:3000'
    ].filter(Boolean)

    const isValidOrigin = allowedOrigins.some(allowedOrigin => 
      origin.startsWith(allowedOrigin as string)
    )

    if (!isValidOrigin) {
      return NextResponse.json(
        { error: 'Invalid origin' },
        { status: 403 }
      )
    }

    return null
  }

  /**
   * Input validation middleware
   */
  static validateInput(data: any, schema: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Basic validation rules
    if (schema.required) {
      schema.required.forEach((field: string) => {
        if (!data[field]) {
          errors.push(`${field} is required`)
        }
      })
    }

    if (schema.email) {
      schema.email.forEach((field: string) => {
        if (data[field] && !this.isValidEmail(data[field])) {
          errors.push(`${field} must be a valid email`)
        }
      })
    }

    if (schema.minLength) {
      Object.entries(schema.minLength).forEach(([field, minLength]) => {
        if (data[field] && data[field].length < (minLength as number)) {
          errors.push(`${field} must be at least ${minLength} characters`)
        }
      })
    }

    if (schema.maxLength) {
      Object.entries(schema.maxLength).forEach(([field, maxLength]) => {
        if (data[field] && data[field].length > (maxLength as number)) {
          errors.push(`${field} must be at most ${maxLength} characters`)
        }
      })
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Sanitize input data
   */
  static sanitizeInput(data: any): any {
    if (typeof data === 'string') {
      return data
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim()
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeInput(item))
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeInput(value)
      }
      return sanitized
    }

    return data
  }

  /**
   * Log security event
   */
  static async logSecurityEvent(event: {
    type: 'RATE_LIMIT' | 'CSRF' | 'INVALID_INPUT' | 'UNAUTHORIZED' | 'SUSPICIOUS_ACTIVITY'
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    message: string
    details?: any
    ipAddress?: string
    userAgent?: string
    tenantId?: string
    userId?: string
  }): Promise<void> {
    try {
      await prisma.systemEvent.create({
        data: {
          type: 'SECURITY',
          severity: event.severity,
          message: `${event.type}: ${event.message}`,
          details: {
            eventType: event.type,
            ipAddress: event.ipAddress,
            userAgent: event.userAgent,
            userId: event.userId,
            ...event.details
          },
          tenantId: event.tenantId
        }
      })
    } catch (error) {
      console.error('Failed to log security event:', error)
    }
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
