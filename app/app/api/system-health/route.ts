
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    
    const where: any = {
      tenantId: 'default-tenant' // TODO: Get from session
    };
    
    if (category) where.category = category;
    if (status) where.status = status;

    const metrics = await prisma.systemHealthMetric.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 100
    });

    // Generate mock real-time data if no data exists
    if (metrics.length === 0) {
      const mockMetrics = [
        { category: 'system', metric: 'cpu_usage', value: 65.2, status: 'healthy', unit: '%' },
        { category: 'system', metric: 'memory_usage', value: 78.5, status: 'warning', unit: '%' },
        { category: 'database', metric: 'response_time', value: 45.3, status: 'healthy', unit: 'ms' },
        { category: 'api', metric: 'error_rate', value: 0.02, status: 'healthy', unit: '%' },
        { category: 'integration', metric: 'uptime', value: 99.9, status: 'healthy', unit: '%' },
        { category: 'security', metric: 'threat_level', value: 2.1, status: 'healthy', unit: 'score' }
      ];

      return NextResponse.json({
        success: true,
        data: mockMetrics.map(m => ({
          ...m,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          threshold: m.metric === 'cpu_usage' ? 80 : m.metric === 'memory_usage' ? 85 : null
        }))
      });
    }

    return NextResponse.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('System health API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch system health metrics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const metric = await prisma.systemHealthMetric.create({
      data: {
        ...body,
        tenantId: 'default-tenant' // TODO: Get from session
      }
    });

    return NextResponse.json({
      success: true,
      data: metric
    });
  } catch (error) {
    console.error('System health create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create health metric' },
      { status: 500 }
    );
  }
}
