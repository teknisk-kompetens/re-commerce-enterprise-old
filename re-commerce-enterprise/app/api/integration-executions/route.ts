
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || 'default-tenant';
    const integrationId = searchParams.get('integrationId');
    const status = searchParams.get('status');

    const where: any = { tenantId };
    if (integrationId) where.integrationId = integrationId;
    if (status) where.status = status;

    const executions = await prisma.integrationExecution.findMany({
      where,
      orderBy: { startTime: 'desc' },
      take: 100,
      include: {
        integration: {
          select: { id: true, name: true, provider: true }
        }
      }
    });

    return NextResponse.json({ executions });
  } catch (error) {
    console.error('Error fetching integration executions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch integration executions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      integrationId, 
      status, 
      duration, 
      recordsProcessed, 
      errorMessage, 
      logs, 
      metadata, 
      tenantId = 'default-tenant' 
    } = body;

    const execution = await prisma.integrationExecution.create({
      data: {
        integrationId,
        status,
        duration,
        recordsProcessed,
        errorMessage,
        logs: logs || [],
        metadata,
        tenantId
      }
    });

    return NextResponse.json({ execution });
  } catch (error) {
    console.error('Error creating integration execution:', error);
    return NextResponse.json(
      { error: 'Failed to create integration execution' },
      { status: 500 }
    );
  }
}
