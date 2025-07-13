
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const environment = searchParams.get('environment');
    const component = searchParams.get('component');
    
    const where: any = {
      tenantId: 'default-tenant' // TODO: Get from session
    };
    
    if (environment) where.environment = environment;
    if (component) where.component = component;

    const validations = await prisma.deploymentValidation.findMany({
      where,
      orderBy: { lastRun: 'desc' }
    });

    // Generate mock deployment validations if no data exists
    if (validations.length === 0) {
      const mockValidations = [
        {
          id: 'dep1',
          environment: 'production',
          component: 'database',
          check: 'Connection Pool Health',
          status: 'passed',
          result: { connections: 45, maxConnections: 100, responseTime: '12ms' },
          lastRun: new Date(),
          duration: 1500,
          isRequired: true
        },
        {
          id: 'dep2',
          environment: 'production',
          component: 'api',
          check: 'Load Balancer Configuration',
          status: 'passed',
          result: { activeNodes: 3, healthyNodes: 3, distribution: 'even' },
          lastRun: new Date(),
          duration: 800,
          isRequired: true
        },
        {
          id: 'dep3',
          environment: 'production',
          component: 'frontend',
          check: 'CDN Configuration',
          status: 'warning',
          result: { cacheHitRatio: 78, expectedMinimum: 85 },
          errorMessage: 'Cache hit ratio below optimal threshold',
          lastRun: new Date(),
          duration: 2100,
          isRequired: false
        },
        {
          id: 'dep4',
          environment: 'staging',
          component: 'infrastructure',
          check: 'Auto-scaling Configuration',
          status: 'passed',
          result: { minInstances: 2, maxInstances: 10, currentInstances: 3 },
          lastRun: new Date(),
          duration: 1200,
          isRequired: true
        },
        {
          id: 'dep5',
          environment: 'production',
          component: 'security',
          check: 'SSL Certificate Validation',
          status: 'passed',
          result: { validUntil: '2025-12-01', issuer: 'LetsEncrypt', strength: 'Strong' },
          lastRun: new Date(),
          duration: 950,
          isRequired: true
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
    console.error('Deployment validations API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deployment validations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = await prisma.deploymentValidation.create({
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
    console.error('Deployment validation create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create deployment validation' },
      { status: 500 }
    );
  }
}
