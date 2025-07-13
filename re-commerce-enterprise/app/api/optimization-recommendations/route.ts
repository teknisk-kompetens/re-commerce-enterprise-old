
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || 'default-tenant';
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const where: any = { tenantId };
    if (category) where.category = category;
    if (status) where.status = status;

    const recommendations = await prisma.optimizationRecommendation.findMany({
      where,
      orderBy: { priority: 'desc' }
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error fetching optimization recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch optimization recommendations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      category, 
      title, 
      description, 
      impact, 
      effort, 
      priority, 
      estimatedImprovement, 
      implementation, 
      tenantId = 'default-tenant' 
    } = body;

    const recommendation = await prisma.optimizationRecommendation.create({
      data: {
        category,
        title,
        description,
        impact,
        effort,
        priority,
        estimatedImprovement,
        implementation,
        tenantId
      }
    });

    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error('Error creating optimization recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to create optimization recommendation' },
      { status: 500 }
    );
  }
}
