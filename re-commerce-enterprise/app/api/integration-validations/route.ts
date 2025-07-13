
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const validations = await prisma.integrationValidation.findMany({
      where: {
        tenantId: 'default-tenant' // TODO: Get from session
      },
      orderBy: { lastCheck: 'desc' }
    });

    // Generate mock validation data if no data exists
    if (validations.length === 0) {
      const mockValidations = [
        {
          id: 'val1',
          name: 'Main API Health Check',
          endpoint: '/api/health',
          method: 'GET',
          expectedStatus: 200,
          status: 'healthy',
          responseTime: 42.5,
          isActive: true,
          lastCheck: new Date()
        },
        {
          id: 'val2',
          name: 'Database Connection',
          endpoint: '/api/db-health',
          method: 'GET',
          expectedStatus: 200,
          status: 'healthy',
          responseTime: 15.2,
          isActive: true,
          lastCheck: new Date()
        },
        {
          id: 'val3',
          name: 'Authentication Service',
          endpoint: '/api/auth/status',
          method: 'GET',
          expectedStatus: 200,
          status: 'degraded',
          responseTime: 150.8,
          isActive: true,
          lastCheck: new Date(),
          errorMessage: 'Response time above threshold'
        },
        {
          id: 'val4',
          name: 'AI Analytics API',
          endpoint: '/api/ai-analytics',
          method: 'GET',
          expectedStatus: 200,
          status: 'healthy',
          responseTime: 85.3,
          isActive: true,
          lastCheck: new Date()
        },
        {
          id: 'val5',
          name: 'Integration Hub',
          endpoint: '/api/integrations',
          method: 'GET',
          expectedStatus: 200,
          status: 'healthy',
          responseTime: 67.1,
          isActive: true,
          lastCheck: new Date()
        }
      ];

      return NextResponse.json({
        success: true,
        data: mockValidations
      });
    }

    return NextResponse.json({
      success: true,
      data: validations
    });
  } catch (error) {
    console.error('Integration validations API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch integration validations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = await prisma.integrationValidation.create({
      data: {
        ...body,
        tenantId: 'default-tenant' // TODO: Get from session
      }
    });

    return NextResponse.json({
      success: true,
      data: validation
    });
  } catch (error) {
    console.error('Integration validation create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create integration validation' },
      { status: 500 }
    );
  }
}
