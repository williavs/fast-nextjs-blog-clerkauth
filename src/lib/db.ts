/**
 * Database connection and query utilities.
 *
 * Provides connection pool and CRUD operations for PostgreSQL database.
 * Supports both blog posts and portfolio projects in separate tables.
 *
 * @module lib/db
 */

import { Pool, QueryResult } from 'pg';
import type { Project, CreateProjectData, UpdateProjectData } from './types/project';

// Re-export types for convenience
export type { Project, CreateProjectData, UpdateProjectData } from './types/project';

/**
 * PostgreSQL connection pool.
 * Reuses connections for better performance.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export { pool };

/**
 * Database error with additional context.
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Blog post database interface (kept for existing blog functionality).
 */
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// PROJECT CRUD FUNCTIONS
// ============================================

/**
 * Get all projects from the database.
 *
 * @returns Promise resolving to array of all projects
 * @throws {DatabaseError} If database query fails
 *
 * @example
 * ```typescript
 * const projects = await getAllProjects();
 * console.log(`Found ${projects.length} projects`);
 * ```
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const result: QueryResult = await pool.query(
      `SELECT * FROM projects ORDER BY created_at DESC`
    );

    return result.rows.map(mapRowToProject);
  } catch (error) {
    throw new DatabaseError(
      'Failed to fetch all projects',
      'getAllProjects',
      error
    );
  }
}

/**
 * Get a project by its slug.
 *
 * @param slug - URL-friendly project identifier
 * @returns Promise resolving to project or null if not found
 * @throws {DatabaseError} If database query fails
 *
 * @example
 * ```typescript
 * const project = await getProjectBySlug('nextui-tui');
 * if (project) {
 *   console.log(project.title);
 * }
 * ```
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const result: QueryResult = await pool.query(
      `SELECT * FROM projects WHERE slug = $1 LIMIT 1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return mapRowToProject(result.rows[0]);
  } catch (error) {
    throw new DatabaseError(
      `Failed to fetch project by slug: ${slug}`,
      'getProjectBySlug',
      error
    );
  }
}

/**
 * Get a project by its ID.
 *
 * @param id - UUID of the project
 * @returns Promise resolving to project or null if not found
 * @throws {DatabaseError} If database query fails
 *
 * @example
 * ```typescript
 * const project = await getProjectById('123e4567-e89b-12d3-a456-426614174000');
 * ```
 */
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const result: QueryResult = await pool.query(
      `SELECT * FROM projects WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return mapRowToProject(result.rows[0]);
  } catch (error) {
    throw new DatabaseError(
      `Failed to fetch project by ID: ${id}`,
      'getProjectById',
      error
    );
  }
}

/**
 * Save a new project to the database.
 *
 * @param projectData - Project data without auto-generated fields
 * @returns Promise resolving to the created project with all fields
 * @throws {DatabaseError} If database insert fails
 *
 * @example
 * ```typescript
 * const newProject = await saveProject({
 *   slug: 'my-tui-app',
 *   title: 'My TUI App',
 *   description: 'A terminal UI application',
 *   category: 'TUI',
 *   source: 'github',
 *   github_url: 'https://github.com/user/my-tui-app',
 *   github_owner: 'user',
 *   github_repo: 'my-tui-app'
 * });
 * ```
 */
export async function saveProject(projectData: CreateProjectData): Promise<Project> {
  try {
    const result: QueryResult = await pool.query(
      `INSERT INTO projects (
        slug, title, description, category, source,
        github_url, github_owner, github_repo, stars, language,
        manual_screenshot_url, manual_images,
        tech_stack, homepage_url, install_command, readme_content,
        last_synced_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12,
        $13, $14, $15, $16,
        $17
      )
      RETURNING *`,
      [
        projectData.slug,
        projectData.title,
        projectData.description ?? null,
        projectData.category,
        projectData.source,
        projectData.github_url ?? null,
        projectData.github_owner ?? null,
        projectData.github_repo ?? null,
        projectData.stars ?? null,
        projectData.language ?? null,
        projectData.manual_screenshot_url ?? null,
        projectData.manual_images ?? null,
        projectData.tech_stack ?? null,
        projectData.homepage_url ?? null,
        projectData.install_command ?? null,
        projectData.readme_content ?? null,
        projectData.last_synced_at ?? null,
      ]
    );

    return mapRowToProject(result.rows[0]);
  } catch (error) {
    throw new DatabaseError(
      `Failed to save project: ${projectData.slug}`,
      'saveProject',
      error
    );
  }
}

/**
 * Update an existing project.
 *
 * @param id - UUID of the project to update
 * @param data - Partial project data to update
 * @returns Promise resolving to the updated project
 * @throws {DatabaseError} If database update fails or project not found
 *
 * @example
 * ```typescript
 * const updated = await updateProject('123e4567...', {
 *   stars: 42,
 *   description: 'Updated description'
 * });
 * ```
 */
export async function updateProject(
  id: string,
  data: Omit<UpdateProjectData, 'id'>
): Promise<Project> {
  try {
    // Build dynamic UPDATE query based on provided fields
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    // Add updated_at timestamp
    updates.push(`updated_at = NOW()`);

    // Add id as last parameter
    values.push(id);

    const result: QueryResult = await pool.query(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error(`Project not found: ${id}`);
    }

    return mapRowToProject(result.rows[0]);
  } catch (error) {
    throw new DatabaseError(
      `Failed to update project: ${id}`,
      'updateProject',
      error
    );
  }
}

/**
 * Delete a project from the database.
 *
 * @param id - UUID of the project to delete
 * @throws {DatabaseError} If database delete fails
 *
 * @example
 * ```typescript
 * await deleteProject('123e4567-e89b-12d3-a456-426614174000');
 * ```
 */
export async function deleteProject(id: string): Promise<void> {
  try {
    await pool.query(`DELETE FROM projects WHERE id = $1`, [id]);
  } catch (error) {
    throw new DatabaseError(
      `Failed to delete project: ${id}`,
      'deleteProject',
      error
    );
  }
}

/**
 * Get recently updated projects within specified time window.
 *
 * Useful for finding projects that need re-syncing or recent changes.
 *
 * @param hours - Number of hours to look back
 * @returns Promise resolving to array of recently updated projects
 * @throws {DatabaseError} If database query fails
 *
 * @example
 * ```typescript
 * // Get projects updated in last 24 hours
 * const recent = await getRecentlyUpdatedProjects(24);
 * ```
 */
export async function getRecentlyUpdatedProjects(hours: number): Promise<Project[]> {
  try {
    const result: QueryResult = await pool.query(
      `SELECT * FROM projects
       WHERE updated_at > NOW() - INTERVAL '${hours} hours'
       ORDER BY updated_at DESC`,
      []
    );

    return result.rows.map(mapRowToProject);
  } catch (error) {
    throw new DatabaseError(
      `Failed to fetch recently updated projects (${hours} hours)`,
      'getRecentlyUpdatedProjects',
      error
    );
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Map database row to Project interface.
 * Handles type conversions and null values.
 *
 * @param row - Raw database row
 * @returns Project object with correct types
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToProject(row: any): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    source: row.source,
    github_url: row.github_url,
    github_owner: row.github_owner,
    github_repo: row.github_repo,
    stars: row.stars,
    language: row.language,
    manual_screenshot_url: row.manual_screenshot_url,
    manual_images: row.manual_images,
    tech_stack: row.tech_stack,
    homepage_url: row.homepage_url,
    install_command: row.install_command,
    readme_content: row.readme_content,
    last_synced_at: row.last_synced_at ? new Date(row.last_synced_at) : null,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  };
}