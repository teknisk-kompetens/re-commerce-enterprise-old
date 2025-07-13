
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const period = searchParams.get('period');
    
    const where: any = {
      tenantId: 'default-tenant' // TODO: Get from session
    };
    
    if (category) where.category = category;
    if (period) where.period = period;

    const metrics = await prisma.executiveMetric.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 50
    });

    // Generate mock executive metrics if no data exists
    if (metrics.length === 0) {
      const now = new Date();
      const mockMetrics = [
        {
          id: 'exec1',
          category: 'financial',
          metric: 'monthly_revenue',
          value: 2547000,
          previousValue: 2398000,
          target: 2600000,
          unit: '$',
          period: 'monthly',
          date: now,
          trend: 'up',
          variance: 6.2,
          insights: 'Revenue growth driven by enterprise client acquisitions'
        },
        {
          id: 'exec2',
          category: 'operational',
          metric: 'customer_satisfaction',
          value: 4.7,
          previousValue: 4.5,
          target: 4.8,
          unit: 'score',
          period: 'monthly',
          date: now,
          trend: 'up',
          variance: 4.4,
          insights: 'Improved satisfaction due to platform stability enhancements'
        },
        {
          id: 'exec3',
          category: 'growth',
          metric: 'user_acquisition',
          value: 1247,
          previousValue: 1156,
          target: 1400,
          unit: 'count',
          period: 'monthly',
          date: now,
          trend: 'up',
          variance: 7.9,
          insights: 'Strong organic growth through referral program'
        },
        {
          id: 'exec4',
          category: 'operational',
          metric: 'system_uptime',
          value: 99.8,
          previousValue: 99.6,
          target: 99.9,
          unit: '%',
          period: 'monthly',
          date: now,
          trend: 'up',
          variance: 0.2,
          insights: 'Infrastructure improvements yielding better reliability'
        },
        {
          id: 'exec5',
          category: 'customer',
          metric: 'churn_rate',
          value: 2.3,
          previousValue: 3.1,
          target: 2.0,
          unit: '%',
          period: 'monthly',
          date: now,
          trend: 'down',
          variance: -25.8,
          insights: 'Reduced churn through proactive customer success initiatives'
        }
      ];

      return NextResponse.json({
        success: true,
        data: mockMetrics
      });
    }

    return NextResponse.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Executive metrics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch executive metrics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const metric = await prisma.executiveMetric.create({
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
    console.error('Executive metric create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create executive metric' },
      { status: 500 }
    );
  }
}
