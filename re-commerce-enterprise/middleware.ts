
import { NextRequest, NextResponse } from 'next/server';
import { SecuritySIEMSystem } from '@/lib/security-siem-system';
import { ProductionSecurityFeatures } from '@/lib/production-security-features';
import { ZeroTrustSecurityEngine } from '@/lib/zero-trust-security';
import { AdvancedThreatDetectionSystem } from '@/lib/advanced-threat-detection';

// Edge runtime compatible UUID generator
function generateEdgeUUID(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${randomPart}-${Math.random().toString(36).substr(2, 4)}`;
}

export async function middleware(request: NextRequest) {
  try {
    // Generate unique request ID (Edge runtime compatible)
    const requestId = generateEdgeUUID();
    
    // Apply DDoS protection first
    const ddosResult = await ProductionSecurityFeatures.applyDDoSProtection(request);
    if (!ddosResult.allowed) {
      // Log security event
      await SecuritySIEMSystem.ingestEvent({
        source: 'ddos_protection',
        type: 'network',
        category: 'access_denied',
        severity: 'high',
        description: `DDoS protection blocked request: ${ddosResult.reason}`,
        actor: request.ip || 'unknown',
        target: request.url,
        outcome: 'blocked',
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        metadata: { requestId, action: ddosResult.action }
      });
      
      return ddosResult.response || new NextResponse('Rate limit exceeded', { status: 429 });
    }

    // Apply WAF protection
    const wafResult = await ProductionSecurityFeatures.processWAFRequest(request);
    if (!wafResult.allowed) {
      // Log security event
      await SecuritySIEMSystem.ingestEvent({
        source: 'waf',
        type: 'application',
        category: 'access_denied',
        severity: wafResult.ruleId ? 'high' : 'medium',
        description: `WAF blocked request: ${wafResult.reason}`,
        actor: request.ip || 'unknown',
        target: request.url,
        outcome: 'blocked',
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        metadata: { requestId, ruleId: wafResult.ruleId, action: wafResult.action }
      });
      
      return wafResult.response || new NextResponse('Blocked by WAF', { status: 403 });
    }

    // Evaluate Zero Trust security context
    const securityContext = await ZeroTrustSecurityEngine.evaluateSecurityContext(request);
    
    // Perform threat analysis
    const threatAnalysis = await AdvancedThreatDetectionSystem.analyzeRequest(request);
    
    // Log security assessment
    if (threatAnalysis.threats.length > 0 || securityContext.riskScore > 50) {
      await SecuritySIEMSystem.ingestEvent({
        source: 'threat_detection',
        type: 'system',
        category: 'threat_detection',
        severity: threatAnalysis.riskScore > 80 ? 'critical' : 
                 threatAnalysis.riskScore > 60 ? 'high' : 'medium',
        description: `Threat analysis completed. Risk score: ${threatAnalysis.riskScore}. Threats: ${threatAnalysis.threats.length}`,
        actor: request.ip || 'unknown',
        target: request.url,
        outcome: 'success',
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        metadata: { 
          requestId, 
          riskScore: threatAnalysis.riskScore,
          threats: threatAnalysis.threats.length,
          securityContext: {
            riskLevel: securityContext.riskLevel,
            accessDecision: securityContext.accessDecision.allowed
          }
        }
      });
    }

    // Block high-risk requests
    if (threatAnalysis.riskScore > 90 || !securityContext.accessDecision.allowed) {
      await SecuritySIEMSystem.createAlert(
        'threat',
        'critical',
        'High-Risk Request Blocked',
        `Request blocked due to high risk score (${threatAnalysis.riskScore}) or access decision failure`,
        'middleware',
        [request.url],
        [request.ip || 'unknown']
      );
      
      return new NextResponse('Access denied - security policy violation', { status: 403 });
    }

    // Create response and apply security headers
    const response = NextResponse.next();
    
    // Apply security headers
    const secureResponse = ProductionSecurityFeatures.applySecurityHeaders(response);
    
    // Add custom security headers
    secureResponse.headers.set('X-Request-ID', requestId);
    secureResponse.headers.set('X-Security-Score', securityContext.riskScore.toString());
    secureResponse.headers.set('X-Threat-Level', securityContext.riskLevel);
    
    // Log successful request
    await SecuritySIEMSystem.ingestEvent({
      source: 'middleware',
      type: 'system',
      category: 'access_granted',
      severity: 'info',
      description: 'Request processed successfully',
      actor: request.ip || 'unknown',
      target: request.url,
      outcome: 'success',
      ipAddress: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      metadata: { 
        requestId,
        riskScore: securityContext.riskScore,
        threatCount: threatAnalysis.threats.length
      }
    });

    return secureResponse;
    
  } catch (error) {
    console.error('Security middleware error:', error);
    
    // Log security error
    await SecuritySIEMSystem.ingestEvent({
      source: 'middleware',
      type: 'system',
      category: 'system_failure',
      severity: 'critical',
      description: `Security middleware error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      actor: 'system',
      target: request.url,
      outcome: 'failure',
      ipAddress: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
    }).catch(console.error);
    
    // Fail securely - allow request but log the error
    const response = NextResponse.next();
    response.headers.set('X-Security-Error', 'true');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
