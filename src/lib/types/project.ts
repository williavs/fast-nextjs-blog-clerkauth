/**
 * Project type definitions for BuiltByWilly portfolio.
 *
 * Defines TypeScript interfaces matching the database schema
 * for projects, GitHub repositories, and metadata extraction.
 *
 * @module lib/types/project
 */

/**
 * Project category enumeration.
 * Represents the primary type/purpose of a project.
 */
export type ProjectCategory = 'TUI' | 'Web' | 'CLI' | 'Python' | 'OSS';

/**
 * Project source enumeration.
 * Indicates how the project was added to the portfolio.
 */
export type ProjectSource = 'github' | 'manual';

/**
 * Complete project data structure matching database schema.
 *
 * Represents a portfolio project with metadata from either
 * GitHub scraping or manual upload via admin interface.
 *
 * @interface Project
 * @example
 * ```typescript
 * const project: Project = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   slug: 'nextui-tui',
 *   title: 'NextUI - Terminal UI Framework',
 *   description: 'A Go-based TUI framework using Bubble Tea',
 *   category: 'TUI',
 *   source: 'github',
 *   github_url: 'https://github.com/willyv3/nextui',
 *   github_owner: 'willyv3',
 *   github_repo: 'nextui',
 *   stars: 42,
 *   language: 'Go',
 *   tech_stack: ['Go', 'Bubble Tea', 'Charm'],
 *   created_at: new Date('2025-10-01'),
 *   updated_at: new Date('2025-10-07')
 * };
 * ```
 */
export interface Project {
  // Core fields
  /** Unique identifier (UUID) */
  id: string;

  /** URL-friendly slug for routing */
  slug: string;

  /** Project title/name */
  title: string;

  /** Project description (optional) */
  description?: string | null;

  /** Project category */
  category: ProjectCategory;

  /** Source of project data */
  source: ProjectSource;

  // GitHub metadata (for github source)
  /** Full GitHub repository URL */
  github_url?: string | null;

  /** GitHub repository owner username */
  github_owner?: string | null;

  /** GitHub repository name */
  github_repo?: string | null;

  /** GitHub star count */
  stars?: number | null;

  /** Primary programming language */
  language?: string | null;

  // Manual upload metadata (for manual source)
  /** Vercel Blob URL for main screenshot */
  manual_screenshot_url?: string | null;

  /** Array of Vercel Blob URLs for additional images */
  manual_images?: string[] | null;

  // Common metadata (both sources)
  /** Array of technologies used (e.g., ['Go', 'React', 'PostgreSQL']) */
  tech_stack?: string[] | null;

  /** Project homepage/demo URL */
  homepage_url?: string | null;

  /** Installation command (e.g., 'brew install willyv3/tap/nextui') */
  install_command?: string | null;

  /** Full README content (markdown) */
  readme_content?: string | null;

  // Timestamps
  /** Last GitHub sync timestamp (for github source) */
  last_synced_at?: Date | null;

  /** Project creation timestamp */
  created_at: Date;

  /** Last update timestamp */
  updated_at: Date;
}

/**
 * GitHub repository data structure.
 *
 * Maps to data returned from existing GitHub scraper.
 * Compatible with RepoInfo from webutils.ts.
 *
 * @interface GitHubRepo
 * @example
 * ```typescript
 * const repo: GitHubRepo = {
 *   owner: 'willyv3',
 *   name: 'nextui',
 *   fullName: 'willyv3/nextui',
 *   url: 'https://github.com/willyv3/nextui',
 *   description: 'Terminal UI framework',
 *   language: 'Go',
 *   stars: 42,
 *   forks: 7,
 *   lastUpdated: '2025-10-07T10:24:00Z',
 *   readme: '# NextUI\n\nA TUI framework...'
 * };
 * ```
 */
export interface GitHubRepo {
  /** GitHub repository owner username */
  owner: string;

  /** GitHub repository name */
  name: string;

  /** Full repository name (owner/name) */
  fullName: string;

  /** Full GitHub repository URL */
  url: string;

  /** Repository description */
  description?: string;

  /** Primary programming language */
  language?: string;

  /** Star count */
  stars?: number;

  /** Fork count */
  forks?: number;

  /** Last updated timestamp (ISO 8601 string) */
  lastUpdated?: string;

  /** README content (markdown) */
  readme?: string;
}

/**
 * Extracted project metadata.
 *
 * Intermediate structure for metadata extraction process.
 * Used during auto-categorization and data transformation.
 *
 * @interface ProjectMetadata
 * @example
 * ```typescript
 * const metadata: ProjectMetadata = {
 *   title: 'NextUI',
 *   description: 'A Go-based TUI framework',
 *   category: 'TUI',
 *   tech_stack: ['Go', 'Bubble Tea', 'Charm'],
 *   language: 'Go',
 *   homepage_url: 'https://github.com/willyv3/nextui',
 *   readme_content: '# NextUI\n\nA TUI framework...',
 *   screenshot_urls: ['https://example.com/screenshot.png']
 * };
 * ```
 */
export interface ProjectMetadata {
  /** Extracted project title */
  title: string;

  /** Extracted project description */
  description?: string;

  /** Auto-detected or manually set category */
  category?: ProjectCategory;

  /** Detected technology stack */
  tech_stack?: string[];

  /** Primary programming language */
  language?: string;

  /** Project homepage URL */
  homepage_url?: string;

  /** README content (markdown) */
  readme_content?: string;

  /** Array of screenshot URLs (from README or manual upload) */
  screenshot_urls?: string[];

  /** Installation command (if detected) */
  install_command?: string;
}

/**
 * Type guard to check if a project is from GitHub.
 *
 * @param project - Project to check
 * @returns True if project is from GitHub source
 * @example
 * ```typescript
 * if (isGitHubProject(project)) {
 *   console.log(project.github_url); // TypeScript knows this exists
 * }
 * ```
 */
export function isGitHubProject(project: Project): project is Project & {
  source: 'github';
  github_url: string;
  github_owner: string;
  github_repo: string;
} {
  return project.source === 'github' &&
         !!project.github_url &&
         !!project.github_owner &&
         !!project.github_repo;
}

/**
 * Type guard to check if a project is manually uploaded.
 *
 * @param project - Project to check
 * @returns True if project is from manual source
 * @example
 * ```typescript
 * if (isManualProject(project)) {
 *   console.log(project.manual_screenshot_url); // TypeScript knows this exists
 * }
 * ```
 */
export function isManualProject(project: Project): project is Project & {
  source: 'manual';
} {
  return project.source === 'manual';
}

/**
 * Partial project data for creating new projects.
 * Omits auto-generated fields (id, created_at, updated_at).
 *
 * @type CreateProjectData
 */
export type CreateProjectData = Omit<Project, 'id' | 'created_at' | 'updated_at'>;

/**
 * Partial project data for updating existing projects.
 * All fields optional except id.
 *
 * @type UpdateProjectData
 */
export type UpdateProjectData = Partial<Omit<Project, 'id'>> & { id: string };
