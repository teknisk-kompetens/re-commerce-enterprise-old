
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || 'default-tenant';
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');

    const where: any = { tenantId };
    if (severity) where.severity = severity;
    if (status) where.status = status;

    const threats = await prisma.threatDetection.findMany({
      where,
      orderBy: { firstSeen: 'desc' },
      take: 50
    });

    return NextResponse.json({ threats });
  } catch (error) {
    console.error('Error fetching threat detections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch threat detections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, 
      severity, 
      source, 
      sourceValue, 
      confidence, 
      details, 
      tenantId = 'default-tenant' 
    } = body;

    const threat = await prisma.threatDetection.create({
      data: {
        type,
        severity,
        source,
        sourceValue,
        confidence,
        details,
        tenantId
      }
    });

    return NextResponse.json({ threat });
  } catch (error) {
    console.error('Error creating threat detection:', error);
    return NextResponse.json(
      { error: 'Failed to create threat detection' },
      { status: 500 }
    );
  }
}
