
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || 'default-tenant';
    const metric = searchParams.get('metric');

    const where: any = { tenantId };
    if (metric) where.metric = metric;

    const predictions = await prisma.predictiveAnalytics.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { metric, prediction, timeframe, tenantId = 'default-tenant' } = body;

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30); // Valid for 30 days

    const predictiveAnalytics = await prisma.predictiveAnalytics.create({
      data: {
        metric,
        prediction,
        timeframe,
        tenantId,
        validUntil
      }
    });

    return NextResponse.json({ predictiveAnalytics });
  } catch (error) {
    console.error('Error creating prediction:', error);
    return NextResponse.json(
      { error: 'Failed to create prediction' },
      { status: 500 }
    );
  }
}
