/**
 * Project aggregation orchestration service.
 *
 * Coordinates GitHub repository fetching, categorization, and database storage.
 * Uses existing scraper without modifications - only orchestrates components.
 *
 * @module lib/aggregation/project-aggregator
 */

import { GitHubAdapter, createDefaultGitHubAdapter } from '@/lib/adapters/github-adapter';
import { AutoCategorizer, createAutoCategorizer } from '@/lib/categorization/auto-categorizer';
import {
  getAllProjects,
  getProjectBySlug,
  saveProject,
  updateProject,
  type Project,
} from '@/lib/db';
import type { CreateProjectData } from '@/lib/types/project';

/**
 * Aggregation result summary.
 */
export interface AggregationResult {
  /** Total projects processed */
  total: number;

  /** New projects created */
  created: number;

  /** Existing projects updated */
  updated: number;

  /** Projects skipped (no changes) */
  skipped: number;

  /** Errors encountered */
  errors: number;

  /** List of all projects */
  projects: Project[];
}

/**
 * Project aggregation orchestrator.
 *
 * Coordinates fetching, categorization, and storage of GitHub projects.
 *
 * @example
 * ```typescript
 * const aggregator = new ProjectAggregator();
 * const result = await aggregator.aggregateGitHubProjects();
 * console.log(`Created ${result.created}, Updated ${result.updated}`);
 * ```
 */
export class ProjectAggregator {
  private githubAdapter: GitHubAdapter;
  private categorizer: AutoCategorizer;
  private lastAggregationTime: Date | null = null;

  constructor(
    githubAdapter: GitHubAdapter = createDefaultGitHubAdapter(),
    categorizer: AutoCategorizer = createAutoCategorizer()
  ) {
    this.githubAdapter = githubAdapter;
    this.categorizer = categorizer;
  }

  /**
   * Aggregate GitHub projects into database.
   *
   * Fetches repositories using EXISTING scraper, categorizes them,
   * and stores in database. Does not modify scraping logic.
   *
   * @param force - If true, skip cache and force refresh all projects
   * @returns Aggregation result summary
   * @throws {Error} If aggregation fails critically
   *
   * @example
   * ```typescript
   * // Normal aggregation (uses cache)
   * const result = await aggregator.aggregateGitHubProjects();
   *
   * // Force refresh (ignores cache)
   * const result = await aggregator.aggregateGitHubProjects(true);
   * ```
   */
  async aggregateGitHubProjects(force: boolean = false): Promise<AggregationResult> {
    console.log('🚀 Starting GitHub project aggregation...');
    console.log(`   Force refresh: ${force ? 'YES' : 'NO'}`);

    const result: AggregationResult = {
      total: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      projects: [],
    };

    try {
      // Check cache (unless force refresh)
      if (!force && this.lastAggregationTime) {
        const hoursSinceLastSync = (Date.now() - this.lastAggregationTime.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastSync < 24) {
          console.log(`⏭️  Skipping: Last sync was ${hoursSinceLastSync.toFixed(1)} hours ago (< 24h)`);
          const projects = await getAllProjects();
          return { ...result, projects, skipped: projects.length };
        }
      }

      // Fetch repos using EXISTING scraper (no modifications)
      console.log('📦 Fetching GitHub repositories...');
      const repos = await this.githubAdapter.fetchAllRepos();
      console.log(`✓ Found ${repos.length} repositories`);

      result.total = repos.length;

      // Process each repository
      for (const repo of repos) {
        try {
          console.log(`\n  Processing: ${repo.fullName}`);

          // Extract metadata using EXISTING data (no new scraping)
          const metadata = this.githubAdapter.extractMetadata(repo);

          // Categorize project based on EXISTING data
          const categorization = this.categorizer.categorize(metadata);
          console.log(`    Category: ${categorization.category} (${(categorization.confidence * 100).toFixed(0)}% confidence)`);
          console.log(`    Reasoning: ${categorization.reasoning}`);

          // Create complete project data
          const projectData: CreateProjectData = {
            ...metadata,
            category: categorization.category,
          };

          // Check if project exists
          const existingProject = await getProjectBySlug(projectData.slug);

          if (existingProject) {
            // Update existing project
            const shouldUpdate = this.shouldUpdateProject(existingProject, projectData);

            if (shouldUpdate) {
              const updated = await updateProject(existingProject.id, {
                ...projectData,
                last_synced_at: new Date(),
              });
              result.updated++;
              result.projects.push(updated);
              console.log(`    ✓ Updated existing project`);
            } else {
              result.skipped++;
              result.projects.push(existingProject);
              console.log(`    ⏭️  Skipped (no changes)`);
            }
          } else {
            // Create new project
            const created = await saveProject(projectData);
            result.created++;
            result.projects.push(created);
            console.log(`    ✓ Created new project`);
          }
        } catch (error) {
          result.errors++;
          console.error(`    ✗ Error processing ${repo.fullName}:`, error);
        }
      }

      // Update last aggregation time
      this.lastAggregationTime = new Date();

      console.log('\n✅ Aggregation complete!');
      console.log(`   Total: ${result.total}`);
      console.log(`   Created: ${result.created}`);
      console.log(`   Updated: ${result.updated}`);
      console.log(`   Skipped: ${result.skipped}`);
      console.log(`   Errors: ${result.errors}`);

      return result;
    } catch (error) {
      console.error('❌ Fatal error during aggregation:', error);
      throw new Error(`GitHub project aggregation failed: ${error}`);
    }
  }

  /**
   * Determine if project should be updated.
   *
   * Compares existing project with new data to decide if update is needed.
   *
   * @param existing - Existing project in database
   * @param newData - New project data from GitHub
   * @returns True if project should be updated
   * @private
   */
  private shouldUpdateProject(
    existing: Project,
    newData: CreateProjectData
  ): boolean {
    // Always update if force refresh or no last sync
    if (!existing.last_synced_at) {
      return true;
    }

    // Update if star count changed
    if (existing.stars !== newData.stars) {
      return true;
    }

    // Update if description changed
    if (existing.description !== newData.description) {
      return true;
    }

    // Update if language changed
    if (existing.language !== newData.language) {
      return true;
    }

    // Update if README changed (length comparison for simplicity)
    const oldReadmeLength = existing.readme_content?.length || 0;
    const newReadmeLength = newData.readme_content?.length || 0;
    if (Math.abs(oldReadmeLength - newReadmeLength) > 100) {
      return true;
    }

    // No significant changes
    return false;
  }

  /**
   * Get last aggregation timestamp.
   */
  getLastAggregationTime(): Date | null {
    return this.lastAggregationTime;
  }

  /**
   * Clear aggregation cache.
   */
  clearCache(): void {
    this.lastAggregationTime = null;
    console.log('🗑️  Aggregation cache cleared');
  }
}

/**
 * Create a default project aggregator instance.
 */
export function createProjectAggregator(): ProjectAggregator {
  return new ProjectAggregator();
}
