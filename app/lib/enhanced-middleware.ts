
import { NextRequest, NextResponse } from 'next/server'
import { SecurityMiddleware } from './security-middleware'
import { FeatureFlagService } from './feature-flag-service'
import { EnterpriseConfig } from './enterprise-config'

export class EnhancedMiddleware {
  /**
   * Enhanced security middleware with all protections
   */
  static async applySecurityMiddleware(request: NextRequest): Promise<NextResponse | null> {
    const pathname = request.nextUrl.pathname

    // Skip security for static files
    if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
      return null
    }

    // Apply rate limiting
    const rateLimitResult = await SecurityMiddleware.rateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      max: await EnterpriseConfig.get('rate_limit.api_requests_per_minute', 100)
    })

    if (rateLimitResult) {
      await SecurityMiddleware.logSecurityEvent({
        type: 'RATE_LIMIT',
        severity: 'MEDIUM',
        message: `Rate limit exceeded for ${pathname}`,
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: { pathname }
      })
      return rateLimitResult
    }

    // Apply CSRF protection for state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      const csrfResult = await SecurityMiddleware.csrfProtection(request)
      if (csrfResult) {
        await SecurityMiddleware.logSecurityEvent({
          type: 'CSRF',
          severity: 'HIGH',
          message: `CSRF protection triggered for ${pathname}`,
          ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          details: { pathname, method: request.method }
        })
        return csrfResult
      }
    }

    // Apply additional security headers
    const response = NextResponse.next()
    
    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
    
    response.headers.set('Content-Security-Policy', csp)

    // HTTPS enforcement (if not in development)
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }

    return response
  }

  /**
   * Feature flag middleware
   */
  static async applyFeatureFlags(request: NextRequest): Promise<NextResponse | null> {
    const pathname = request.nextUrl.pathname
    const tenantId = request.headers.get('x-tenant-id') || undefined

    // Check if feature flags are enabled
    const featureFlagsEnabled = await FeatureFlagService.isEnabled('system.feature_flags', { tenantId })
    if (!featureFlagsEnabled) {
      return null
    }

    // Check specific feature flags based on pathname
    if (pathname.startsWith('/api/auth')) {
      // Check MFA requirement
      const mfaRequired = await FeatureFlagService.isEnabled('auth.mfa_required', { tenantId })
      if (mfaRequired) {
        // Add MFA requirement header
        const response = NextResponse.next()
        response.headers.set('X-MFA-Required', 'true')
        return response
      }
    }

    if (pathname.startsWith('/api/users')) {
      // Check user management features
      const selfRegistration = await FeatureFlagService.isEnabled('users.self_registration', { tenantId })
      if (!selfRegistration && pathname.includes('/register')) {
        return NextResponse.json(
          { error: 'Self registration is disabled' },
          { status: 403 }
        )
      }
    }

    if (pathname.startsWith('/api/integrations')) {
      // Check API access
      const apiAccess = await FeatureFlagService.isEnabled('integrations.api_access', { tenantId })
      if (!apiAccess) {
        return NextResponse.json(
          { error: 'API access is disabled' },
          { status: 403 }
        )
      }
    }

    return null
  }

  /**
   * Performance monitoring middleware
   */
  static async applyPerformanceMonitoring(request: NextRequest): Promise<NextResponse | null> {
    const startTime = Date.now()
    const pathname = request.nextUrl.pathname

    // Continue with request
    const response = NextResponse.next()

    // Add performance headers
    const processingTime = Date.now() - startTime
    response.headers.set('X-Processing-Time', `${processingTime}ms`)
    response.headers.set('X-Timestamp', new Date().toISOString())

    // Log slow requests
    if (processingTime > 1000) { // 1 second
      await SecurityMiddleware.logSecurityEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        severity: 'LOW',
        message: `Slow request detected: ${pathname}`,
        details: { 
          pathname, 
          processingTime, 
          method: request.method,
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      })
    }

    return response
  }

  /**
   * Combined middleware application
   */
  static async apply(request: NextRequest): Promise<NextResponse> {
    // Apply security middleware
    const securityResult = await this.applySecurityMiddleware(request)
    if (securityResult && securityResult.status !== 200) {
      return securityResult
    }

    // Apply feature flag middleware
    const featureFlagResult = await this.applyFeatureFlags(request)
    if (featureFlagResult && featureFlagResult.status !== 200) {
      return featureFlagResult
    }

    // Apply performance monitoring
    const performanceResult = await this.applyPerformanceMonitoring(request)
    if (performanceResult) {
      return performanceResult
    }

    // If all middleware passes, return the security result or continue
    return securityResult || NextResponse.next()
  }
}
