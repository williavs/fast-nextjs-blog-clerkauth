/**
 * Vercel Blob upload API endpoint.
 *
 * Handles file uploads to Vercel Blob storage with public access.
 * Protected by Clerk authentication - only authenticated users can upload.
 *
 * @module app/api/upload
 */

import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * Upload file to Vercel Blob storage.
 *
 * POST /api/upload?filename=image.png
 *
 * @param request - Request with file body
 * @returns JSON response with blob URL
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/upload?filename=screenshot.png', {
 *   method: 'POST',
 *   body: file,
 * });
 * const { url } = await response.json();
 * ```
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get filename from query params
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Missing filename parameter' },
        { status: 400 }
      );
    }

    // Validate filename
    if (!isValidFilename(filename)) {
      return NextResponse.json(
        { error: 'Invalid filename. Only alphanumeric, hyphens, underscores, and dots allowed.' },
        { status: 400 }
      );
    }

    // Check content type is an image
    const contentType = request.headers.get('content-type');
    if (contentType && !contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image uploads are supported' },
        { status: 400 }
      );
    }

    // Get file body
    const body = await request.blob();

    if (!body || body.size === 0) {
      return NextResponse.json(
        { error: 'Empty file' },
        { status: 400 }
      );
    }

    // Check file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (body.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(filename, body, {
      access: 'public',
      addRandomSuffix: true, // Avoid filename collisions
    });

    console.log('✅ Uploaded file to Vercel Blob:', blob.url);

    // Return blob URL
    return NextResponse.json({
      url: blob.url,
      size: body.size,
      filename: filename,
    });

  } catch (error) {
    console.error('❌ Blob upload error:', error);

    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Validate filename for security.
 * Prevents path traversal and malicious filenames.
 */
function isValidFilename(filename: string): boolean {
  // Must have an extension
  if (!filename.includes('.')) {
    return false;
  }

  // Only allow safe characters
  const safeFilenameRegex = /^[a-zA-Z0-9._-]+$/;
  if (!safeFilenameRegex.test(filename)) {
    return false;
  }

  // Prevent path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false;
  }

  // Allowed image extensions
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasAllowedExtension = allowedExtensions.some(ext =>
    filename.toLowerCase().endsWith(ext)
  );

  return hasAllowedExtension;
}
