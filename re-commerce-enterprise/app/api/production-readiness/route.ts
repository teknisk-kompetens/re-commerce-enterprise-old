
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

    const checklist = await prisma.productionReadinessChecklist.findMany({
      where,
      include: {
        assignee: {
          select: { name: true, email: true }
        }
      },
      orderBy: { priority: 'desc' }
    });

    // Generate mock checklist if no data exists
    if (checklist.length === 0) {
      const mockChecklist = [
        {
          id: 'check1',
          category: 'security',
          item: 'SSL Certificate Configuration',
          description: 'Ensure all environments have valid SSL certificates',
          priority: 'critical',
          status: 'completed',
          assignee: { name: 'Security Team', email: 'security@re-commerce.com' },
          completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          evidence: { certificateInfo: 'Valid until 2025-12-01' }
        },
        {
          id: 'check2',
          category: 'performance',
          item: 'Load Testing Validation',
          description: 'Verify system can handle expected peak load',
          priority: 'critical',
          status: 'in-progress',
          assignee: { name: 'Performance Team', email: 'perf@re-commerce.com' },
          notes: 'Testing with 10,000 concurrent users'
        },
        {
          id: 'check3',
          category: 'infrastructure',
          item: 'Database Backup Strategy',
          description: 'Implement automated backup and recovery procedures',
          priority: 'high',
          status: 'completed',
          assignee: { name: 'DevOps Team', email: 'devops@re-commerce.com' },
          completedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
          evidence: { backupSchedule: 'Every 6 hours with 30-day retention' }
        },
        {
          id: 'check4',
          category: 'compliance',
          item: 'GDPR Compliance Review',
          description: 'Complete data privacy and GDPR compliance audit',
          priority: 'high',
          status: 'pending',
          assignee: { name: 'Legal Team', email: 'legal@re-commerce.com' },
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'check5',
          category: 'testing',
          item: 'End-to-End Test Coverage',
          description: 'Achieve 95% test coverage for critical user journeys',
          priority: 'medium',
          status: 'in-progress',
          assignee: { name: 'QA Team', email: 'qa@re-commerce.com' },
          notes: 'Currently at 87% coverage'
        }
      ];

      return NextResponse.json({
        success: true,
        data: mockChecklist
      });
    }

    return NextResponse.json({
      success: true,
      data: checklist
    });
  } catch (error) {
    console.error('Production readiness API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch production readiness checklist' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const checklistItem = await prisma.productionReadinessChecklist.create({
      data: {
        ...body,
        tenantId: 'default-tenant' // TODO: Get from session
      }
    });

    return NextResponse.json({
      success: true,
      data: checklistItem
    });
  } catch (error) {
    console.error('Production readiness create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create checklist item' },
      { status: 500 }
    );
  }
}
