
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || 'default-tenant';
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const where: any = { tenantId };
    if (type) where.type = type;
    if (status) where.status = status;

    const integrations = await prisma.integration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        executions: {
          take: 5,
          orderBy: { startTime: 'desc' }
        }
      }
    });

    return NextResponse.json({ integrations });
  } catch (error) {
    console.error('Error fetching integrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch integrations' },
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
      category, 
      provider, 
      config, 
      credentials, 
      endpoints, 
      rateLimits, 
      tenantId = 'default-tenant',
      configuredBy 
    } = body;

    const integration = await prisma.integration.create({
      data: {
        name,
        type,
        category,
        provider,
        config,
        credentials,
        endpoints,
        rateLimits,
        tenantId,
        configuredBy
      }
    });

    return NextResponse.json({ integration });
  } catch (error) {
    console.error('Error creating integration:', error);
    return NextResponse.json(
      { error: 'Failed to create integration' },
      { status: 500 }
    );
  }
}
