
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const published = searchParams.get('published');
    
    const where: any = {
      tenantId: 'default-tenant' // TODO: Get from session
    };
    
    if (category) where.category = category;
    if (published) where.isPublished = published === 'true';

    const documentation = await prisma.documentationCenter.findMany({
      where,
      include: {
        author: {
          select: { name: true, email: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Generate mock documentation if no data exists
    if (documentation.length === 0) {
      const mockDocs = [
        {
          id: 'doc1',
          title: 'Getting Started Guide',
          content: '# Getting Started\n\nWelcome to the re:commerce Enterprise platform...',
          category: 'getting-started',
          tags: ['onboarding', 'basics'],
          version: '1.0',
          isPublished: true,
          viewCount: 156,
          author: { name: 'System Admin', email: 'admin@re-commerce.com' }
        },
        {
          id: 'doc2',
          title: 'API Authentication',
          content: '# API Authentication\n\nLearn how to authenticate with our APIs...',
          category: 'api',
          tags: ['api', 'authentication', 'security'],
          version: '2.1',
          isPublished: true,
          viewCount: 89,
          author: { name: 'Tech Team', email: 'tech@re-commerce.com' }
        },
        {
          id: 'doc3',
          title: 'AI Analytics Tutorial',
          content: '# AI Analytics\n\nDiscover the power of AI-driven insights...',
          category: 'tutorials',
          tags: ['ai', 'analytics', 'tutorial'],
          version: '1.2',
          isPublished: true,
          viewCount: 124,
          author: { name: 'AI Team', email: 'ai@re-commerce.com' }
        },
        {
          id: 'doc4',
          title: 'Troubleshooting Common Issues',
          content: '# Troubleshooting\n\nSolutions to common platform issues...',
          category: 'troubleshooting',
          tags: ['help', 'issues', 'support'],
          version: '1.5',
          isPublished: true,
          viewCount: 267,
          author: { name: 'Support Team', email: 'support@re-commerce.com' }
        }
      ];

      return NextResponse.json({
        success: true,
        data: mockDocs
      });
    }

    return NextResponse.json({
      success: true,
      data: documentation
    });
  } catch (error) {
    console.error('Documentation center API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documentation' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const documentation = await prisma.documentationCenter.create({
      data: {
        ...body,
        tenantId: 'default-tenant', // TODO: Get from session
        authorId: 'default-user-id' // TODO: Get from session
      }
    });

    return NextResponse.json({
      success: true,
      data: documentation
    });
  } catch (error) {
    console.error('Documentation create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create documentation' },
      { status: 500 }
    );
  }
}
