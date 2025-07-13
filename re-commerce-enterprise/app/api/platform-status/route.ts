
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const component = searchParams.get('component');
    
    const where: any = {
      tenantId: 'default-tenant' // TODO: Get from session
    };
    
    if (component) where.component = component;

    const statuses = await prisma.platformStatus.findMany({
      where,
      orderBy: { startTime: 'desc' },
      take: 20
    });

    // Generate mock platform status if no data exists
    if (statuses.length === 0) {
      const mockStatuses = [
        {
          id: 'status1',
          component: 'overall',
          status: 'operational',
          message: 'All systems operational',
          severity: 'info',
          startTime: new Date(),
          isResolved: true
        },
        {
          id: 'status2',
          component: 'day1',
          status: 'operational',
          message: 'Core platform features running smoothly',
          details: { uptime: '99.9%', responseTime: '45ms' },
          severity: 'info',
          startTime: new Date(),
          isResolved: true
        },
        {
          id: 'status3',
          component: 'day2',
          status: 'operational',
          message: 'Advanced dashboard and collaboration features active',
          details: { activeUsers: 1247, realTimeConnections: 89 },
          severity: 'info',
          startTime: new Date(),
          isResolved: true
        },
        {
          id: 'status4',
          component: 'day3',
          status: 'operational',
          message: 'Mobile and workflow management systems optimal',
          details: { mobileUsers: 456, activeWorkflows: 23 },
          severity: 'info',
          startTime: new Date(),
          isResolved: true
        },
        {
          id: 'status5',
          component: 'day4',
          status: 'degraded',
          message: 'AI Analytics experiencing minor latency',
          details: { avgResponseTime: '850ms', expectedTime: '500ms' },
          severity: 'warning',
          startTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          isResolved: false
        },
        {
          id: 'status6',
          component: 'day5',
          status: 'operational',
          message: 'Enterprise completion features fully active',
          details: { completionRate: '98.5%', allFeaturesOnline: true },
          severity: 'info',
          startTime: new Date(),
          isResolved: true
        }
      ];

      return NextResponse.json({
        success: true,
        data: mockStatuses
      });
    }

    return NextResponse.json({
      success: true,
      data: statuses
    });
  } catch (error) {
    console.error('Platform status API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch platform status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const status = await prisma.platformStatus.create({
      data: {
        ...body,
        tenantId: 'default-tenant' // TODO: Get from session
      }
    });

    return NextResponse.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Platform status create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create platform status' },
      { status: 500 }
    );
  }
}
