
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || 'default-tenant';
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');

    const where: any = { tenantId };
    if (type) where.type = type;
    if (isActive !== null) where.isActive = isActive === 'true';

    const connectors = await prisma.apiConnector.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({ connectors });
  } catch (error) {
    console.error('Error fetching API connectors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API connectors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      type, 
      baseUrl, 
      auth, 
      headers, 
      rateLimits, 
      timeout, 
      retryPolicy, 
      healthCheck, 
      tenantId = 'default-tenant',
      createdBy 
    } = body;

    const connector = await prisma.apiConnector.create({
      data: {
        name,
        type,
        baseUrl,
        auth,
        headers,
        rateLimits,
        timeout: timeout || 30000,
        retryPolicy,
        healthCheck,
        tenantId,
        createdBy
      }
    });

    return NextResponse.json({ connector });
  } catch (error) {
    console.error('Error creating API connector:', error);
    return NextResponse.json(
      { error: 'Failed to create API connector' },
      { status: 500 }
    );
  }
}
