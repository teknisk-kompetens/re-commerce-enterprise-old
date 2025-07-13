
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    
    const where: any = {
      tenantId: 'default-tenant' // TODO: Get from session
    };
    
    if (category) where.category = category;
    if (status) where.status = status;

    const roiData = await prisma.rOITracking.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Generate mock ROI tracking data if no data exists
    if (roiData.length === 0) {
      const mockROI = [
        {
          id: 'roi1',
          initiative: 'AI Analytics Implementation',
          category: 'technology',
          investment: 875000,
          returns: 1456000,
          roi: 66.4,
          period: '12 months',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          status: 'completed',
          description: 'AI-powered analytics platform deployment',
          methodology: 'Cost savings + revenue increase from better insights',
          confidence: 0.92,
          notes: 'Exceeded expectations with faster decision-making'
        },
        {
          id: 'roi2',
          initiative: 'Security Infrastructure Upgrade',
          category: 'technology',
          investment: 450000,
          returns: 720000,
          roi: 60.0,
          period: '18 months',
          startDate: new Date('2023-06-01'),
          endDate: new Date('2024-12-01'),
          status: 'completed',
          description: 'Enterprise-grade security system implementation',
          methodology: 'Avoided security incidents + compliance benefits',
          confidence: 0.87,
          notes: 'Prevented 3 major security incidents'
        },
        {
          id: 'roi3',
          initiative: 'Process Automation Project',
          category: 'operations',
          investment: 320000,
          returns: 580000,
          roi: 81.3,
          period: '9 months',
          startDate: new Date('2024-03-01'),
          endDate: null,
          status: 'active',
          description: 'Workflow automation across key business processes',
          methodology: 'Labor cost savings + efficiency gains',
          confidence: 0.79,
          notes: 'On track to exceed projections'
        },
        {
          id: 'roi4',
          initiative: 'Customer Experience Platform',
          category: 'marketing',
          investment: 680000,
          returns: 1240000,
          roi: 82.4,
          period: '15 months',
          startDate: new Date('2023-09-01'),
          endDate: new Date('2024-12-01'),
          status: 'completed',
          description: 'Integrated customer experience and analytics platform',
          methodology: 'Increased customer lifetime value + reduced churn',
          confidence: 0.94,
          notes: 'Significant improvement in customer satisfaction'
        }
      ];

      return NextResponse.json({
        success: true,
        data: mockROI
      });
    }

    return NextResponse.json({
      success: true,
      data: roiData
    });
  } catch (error) {
    console.error('ROI tracking API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ROI tracking data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const roiData = await prisma.rOITracking.create({
      data: {
        ...body,
        tenantId: 'default-tenant' // TODO: Get from session
      }
    });

    return NextResponse.json({
      success: true,
      data: roiData
    });
  } catch (error) {
    console.error('ROI tracking create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ROI tracking data' },
      { status: 500 }
    );
  }
}
