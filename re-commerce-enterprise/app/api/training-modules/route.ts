
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    
    const where: any = {
      tenantId: 'default-tenant' // TODO: Get from session
    };
    
    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;

    const modules = await prisma.trainingModule.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Generate mock training modules if no data exists
    if (modules.length === 0) {
      const mockModules = [
        {
          id: 'mod1',
          title: 'Platform Onboarding',
          description: 'Complete introduction to the re:commerce platform',
          content: 'Interactive onboarding content...',
          type: 'interactive',
          duration: 45,
          difficulty: 'beginner',
          prerequisites: [],
          objectives: ['Understand platform basics', 'Navigate the dashboard', 'Complete first task'],
          isRequired: true,
          completionRate: 78.5
        },
        {
          id: 'mod2',
          title: 'AI Analytics Mastery',
          description: 'Deep dive into AI-powered analytics features',
          content: 'Advanced AI analytics training...',
          type: 'video',
          duration: 65,
          difficulty: 'intermediate',
          prerequisites: ['Platform Onboarding'],
          objectives: ['Configure AI analytics', 'Interpret insights', 'Create custom dashboards'],
          isRequired: false,
          completionRate: 45.2
        },
        {
          id: 'mod3',
          title: 'Security Best Practices',
          description: 'Essential security practices for platform users',
          content: 'Security training content...',
          type: 'quiz',
          duration: 30,
          difficulty: 'intermediate',
          prerequisites: ['Platform Onboarding'],
          objectives: ['Understand security policies', 'Implement best practices', 'Handle sensitive data'],
          isRequired: true,
          completionRate: 92.1
        },
        {
          id: 'mod4',
          title: 'Advanced Integrations',
          description: 'Master complex integration scenarios',
          content: 'Advanced integration training...',
          type: 'document',
          duration: 90,
          difficulty: 'advanced',
          prerequisites: ['Platform Onboarding', 'AI Analytics Mastery'],
          objectives: ['Build custom integrations', 'Troubleshoot issues', 'Optimize performance'],
          isRequired: false,
          completionRate: 23.7
        }
      ];

      return NextResponse.json({
        success: true,
        data: mockModules
      });
    }

    return NextResponse.json({
      success: true,
      data: modules
    });
  } catch (error) {
    console.error('Training modules API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch training modules' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const module = await prisma.trainingModule.create({
      data: {
        ...body,
        tenantId: 'default-tenant' // TODO: Get from session
      }
    });

    return NextResponse.json({
      success: true,
      data: module
    });
  } catch (error) {
    console.error('Training module create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create training module' },
      { status: 500 }
    );
  }
}
