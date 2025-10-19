/**
 * Projects API - Create endpoint.
 *
 * POST /api/backstage/projects - Create new project
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { saveProject } from '@/lib/db';
import type { CreateProjectData } from '@/lib/types/project';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.slug || !body.title || !body.category || !body.source) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, category, source' },
        { status: 400 }
      );
    }

    // Create project data
    const projectData: CreateProjectData = {
      slug: body.slug,
      title: body.title,
      description: body.description || null,
      category: body.category,
      source: body.source,

      // GitHub fields (null for manual projects)
      github_url: body.github_url || null,
      github_owner: body.github_owner || null,
      github_repo: body.github_repo || null,
      stars: body.stars || null,
      language: body.language || null,

      // Manual upload fields
      manual_screenshot_url: body.manual_screenshot_url || null,
      manual_images: body.manual_images || null,

      // Common fields
      tech_stack: body.tech_stack || null,
      homepage_url: body.homepage_url || null,
      install_command: body.install_command || null,
      readme_content: body.readme_content || null,

      // Timestamps
      last_synced_at: body.last_synced_at ? new Date(body.last_synced_at) : null,
    };

    // Save to database
    const project = await saveProject(projectData);

    console.log('✅ Created project:', project.slug);

    return NextResponse.json(project, { status: 201 });

  } catch (error) {
    console.error('❌ Project creation error:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
