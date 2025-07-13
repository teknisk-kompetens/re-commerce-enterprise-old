
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || 'default-tenant';
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    const where: any = { tenantId };
    if (type) where.type = type;
    if (category) where.category = category;

    const insights = await prisma.aiInsight.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI insights' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, 
      category, 
      title, 
      description, 
      confidence, 
      impact, 
      data, 
      tenantId = 'default-tenant',
      userId 
    } = body;

    const insight = await prisma.aiInsight.create({
      data: {
        type,
        category,
        title,
        description,
        confidence,
        impact,
        data,
        tenantId,
        userId
      }
    });

    return NextResponse.json({ insight });
  } catch (error) {
    console.error('Error creating AI insight:', error);
    return NextResponse.json(
      { error: 'Failed to create AI insight' },
      { status: 500 }
    );
  }
}
