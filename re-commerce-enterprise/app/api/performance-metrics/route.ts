
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || 'default-tenant';
    const metric = searchParams.get('metric');
    const source = searchParams.get('source');
    const hours = parseInt(searchParams.get('hours') || '24');

    const where: any = { tenantId };
    if (metric) where.metric = metric;
    if (source) where.source = source;

    // Filter by time range
    const timeFilter = new Date();
    timeFilter.setHours(timeFilter.getHours() - hours);
    where.timestamp = { gte: timeFilter };

    const metrics = await prisma.performanceMetric.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 1000
    });

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance metrics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      metric, 
      value, 
      unit, 
      source, 
      endpoint, 
      metadata, 
      tenantId = 'default-tenant' 
    } = body;

    const performanceMetric = await prisma.performanceMetric.create({
      data: {
        metric,
        value,
        unit,
        source,
        endpoint,
        metadata,
        tenantId
      }
    });

    return NextResponse.json({ performanceMetric });
  } catch (error) {
    console.error('Error creating performance metric:', error);
    return NextResponse.json(
      { error: 'Failed to create performance metric' },
      { status: 500 }
    );
  }
}
