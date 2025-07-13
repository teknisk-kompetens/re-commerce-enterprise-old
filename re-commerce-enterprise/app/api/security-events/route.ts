
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

    const events = await prisma.securityEvent.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 100,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching security events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch security events' },
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
      title, 
      description, 
      metadata, 
      tenantId = 'default-tenant',
      userId 
    } = body;

    const event = await prisma.securityEvent.create({
      data: {
        type,
        severity,
        source,
        title,
        description,
        metadata,
        tenantId,
        userId
      }
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error creating security event:', error);
    return NextResponse.json(
      { error: 'Failed to create security event' },
      { status: 500 }
    );
  }
}
