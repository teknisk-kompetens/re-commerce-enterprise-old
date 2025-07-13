
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const testSuites = await prisma.testSuite.findMany({
      where: {
        tenantId: 'default-tenant' // TODO: Get from session
      },
      include: {
        executions: {
          orderBy: { startTime: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Generate mock data if no data exists
    if (testSuites.length === 0) {
      const mockSuites = [
        {
          id: 'suite1',
          name: 'Unit Tests',
          description: 'Core functionality unit tests',
          type: 'unit',
          framework: 'jest',
          isActive: true,
          executions: [
            { status: 'passed', duration: 45000, coverage: 87.5 },
            { status: 'failed', duration: 52000, coverage: 85.2 }
          ]
        },
        {
          id: 'suite2',
          name: 'Integration Tests',
          description: 'API and database integration tests',
          type: 'integration',
          framework: 'cypress',
          isActive: true,
          executions: [
            { status: 'passed', duration: 125000, coverage: 92.1 }
          ]
        },
        {
          id: 'suite3',
          name: 'E2E Tests',
          description: 'End-to-end user journey tests',
          type: 'e2e',
          framework: 'playwright',
          isActive: true,
          executions: [
            { status: 'running', duration: null, coverage: null }
          ]
        },
        {
          id: 'suite4',
          name: 'Performance Tests',
          description: 'Load and stress testing',
          type: 'performance',
          framework: 'k6',
          isActive: true,
          executions: [
            { status: 'passed', duration: 180000, coverage: null }
          ]
        }
      ];

      return NextResponse.json({
        success: true,
        data: mockSuites
      });
    }

    return NextResponse.json({
      success: true,
      data: testSuites
    });
  } catch (error) {
    console.error('Test suites API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch test suites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const testSuite = await prisma.testSuite.create({
      data: {
        ...body,
        tenantId: 'default-tenant' // TODO: Get from session
      }
    });

    return NextResponse.json({
      success: true,
      data: testSuite
    });
  } catch (error) {
    console.error('Test suite create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create test suite' },
      { status: 500 }
    );
  }
}
