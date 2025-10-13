/**
 * Projects API - Update and Delete endpoints.
 *
 * PUT /api/backstage/projects/[id] - Update project
 * DELETE /api/backstage/projects/[id] - Delete project
 */

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { updateProject, deleteProject, getProjectById } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Require admin authentication
    await requireAdmin();

    const { id } = await params;

    // Check if project exists
    const existing = await getProjectById(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Update project
    const updated = await updateProject(id, {
      ...body,
      last_synced_at: body.last_synced_at ? new Date(body.last_synced_at) : undefined,
    });

    console.log('✅ Updated project:', updated.slug);

    return NextResponse.json(updated);

  } catch (error) {
    console.error('❌ Project update error:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Require admin authentication
    await requireAdmin();

    const { id } = await params;

    // Check if project exists
    const existing = await getProjectById(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete project
    await deleteProject(id);

    console.log('✅ Deleted project:', existing.slug);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Project deletion error:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to delete project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
