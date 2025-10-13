/**
 * Admin authentication and authorization utilities.
 *
 * Provides helper functions to protect admin-only routes and actions.
 * Only the user with ID matching ADMIN_ID environment variable is authorized.
 *
 * @module lib/admin
 */

import { auth } from '@clerk/nextjs/server';

/**
 * Custom error for unauthorized admin access attempts.
 */
export class UnauthorizedAdminError extends Error {
  constructor(message: string = 'Unauthorized: Admin access required') {
    super(message);
    this.name = 'UnauthorizedAdminError';
  }
}

/**
 * Require admin authentication and authorization.
 *
 * Verifies that the current user is authenticated via Clerk and
 * matches the ADMIN_ID environment variable. Throws an error if
 * the user is not authenticated or not the designated admin.
 *
 * This function should be called at the top of any admin-only
 * route handlers or server actions to protect them from unauthorized access.
 *
 * @throws {UnauthorizedAdminError} If user is not authenticated or not admin
 * @returns Promise resolving to the admin's Clerk user ID
 *
 * @example
 * ```typescript
 * // In a server action or API route
 * export async function deleteProject(id: string) {
 *   await requireAdmin(); // Throws if not admin
 *   // Admin-only logic here...
 * }
 * ```
 *
 * @example
 * ```typescript
 * // In an API route
 * export async function DELETE(request: Request) {
 *   const adminId = await requireAdmin(); // Get admin ID
 *   // Delete logic here...
 *   return Response.json({ success: true });
 * }
 * ```
 */
export async function requireAdmin(): Promise<string> {
  // Get authentication from Clerk
  const { userId } = await auth();

  // Check if user is authenticated
  if (!userId) {
    throw new UnauthorizedAdminError('Authentication required');
  }

  // Verify ADMIN_ID environment variable is set
  const adminId = process.env.ADMIN_ID;
  if (!adminId) {
    console.error('ADMIN_ID environment variable is not set');
    throw new UnauthorizedAdminError('Admin configuration error');
  }

  // Check if authenticated user is the admin
  if (userId !== adminId) {
    console.warn(`Unauthorized admin access attempt by user: ${userId}`);
    throw new UnauthorizedAdminError('Insufficient permissions');
  }

  // User is authenticated and is the admin
  return userId;
}

/**
 * Check if current user is admin without throwing.
 *
 * Returns true if the user is authenticated and is the admin,
 * false otherwise. Useful for conditional UI rendering.
 *
 * @returns Promise resolving to true if user is admin, false otherwise
 *
 * @example
 * ```typescript
 * // In a server component
 * export default async function Header() {
 *   const isAdmin = await isAdmin();
 *
 *   return (
 *     <header>
 *       {isAdmin && <Link href="/backstage">⚙️</Link>}
 *     </header>
 *   );
 * }
 * ```
 */
export async function isAdmin(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}
