
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || 'default-tenant';
    const framework = searchParams.get('framework');

    const where: any = { tenantId };
    if (framework) where.framework = framework;

    const records = await prisma.complianceRecord.findMany({
      where,
      orderBy: { lastCheck: 'desc' }
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error fetching compliance records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      framework, 
      requirement, 
      status, 
      evidence, 
      assignedTo, 
      notes, 
      tenantId = 'default-tenant' 
    } = body;

    const nextCheck = new Date();
    nextCheck.setMonth(nextCheck.getMonth() + 3); // Check again in 3 months

    const record = await prisma.complianceRecord.create({
      data: {
        framework,
        requirement,
        status,
        evidence,
        assignedTo,
        notes,
        tenantId,
        nextCheck
      }
    });

    return NextResponse.json({ record });
  } catch (error) {
    console.error('Error creating compliance record:', error);
    return NextResponse.json(
      { error: 'Failed to create compliance record' },
      { status: 500 }
    );
  }
}
