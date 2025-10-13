/**
 * GitHub repository aggregation adapter.
 *
 * Wraps existing GitHub scraper (src/lib/webutils.ts) to fetch repos
 * from multiple accounts. Does NOT modify scraping logic - only configures
 * which accounts to scrape and maps data to Project types.
 *
 * @module lib/adapters/github-adapter
 */

import { getCompleteRepoInfo, type RepoInfo } from '@/lib/webutils';
import type { GitHubRepo, Project, CreateProjectData } from '@/lib/types/project';

/**
 * GitHub adapter configuration.
 */
export interface GitHubAdapterConfig {
  /** GitHub usernames to scrape */
  accounts: string[];

  /** Maximum number of repos to fetch per account (0 = unlimited) */
  maxReposPerAccount?: number;
}

/**
 * GitHub repository aggregation adapter.
 *
 * Fetches repositories from configured GitHub accounts using the
 * existing scraper. Does not modify scraping logic.
 *
 * @example
 * ```typescript
 * const adapter = new GitHubAdapter({
 *   accounts: ['WillyV3', 'your-github-username']
 * });
 *
 * const repos = await adapter.fetchAllRepos();
 * console.log(`Found ${repos.length} repositories`);
 * ```
 */
export class GitHubAdapter {
  private config: GitHubAdapterConfig;

  constructor(config: GitHubAdapterConfig) {
    this.config = {
      maxReposPerAccount: 100,
      ...config
    };
  }

  /**
   * Fetch all repositories from configured GitHub accounts.
   *
   * Uses existing scraper to get repo details. Does not modify
   * scraping logic - only coordinates fetching from multiple accounts.
   *
   * @returns Promise resolving to array of GitHub repositories
   * @throws {Error} If fetching fails for all accounts
   *
   * @example
   * ```typescript
   * const repos = await adapter.fetchAllRepos();
   * ```
   */
  async fetchAllRepos(): Promise<GitHubRepo[]> {
    const allRepos: GitHubRepo[] = [];

    for (const account of this.config.accounts) {
      try {
        console.log(`Fetching repositories for ${account}...`);
        const repos = await this.fetchUserRepos(account);
        allRepos.push(...repos);
        console.log(`✓ Found ${repos.length} repos for ${account}`);
      } catch (error) {
        console.error(`✗ Failed to fetch repos for ${account}:`, error);
        // Continue with other accounts even if one fails
      }
    }

    if (allRepos.length === 0) {
      throw new Error('Failed to fetch repositories from all accounts');
    }

    return allRepos;
  }

  /**
   * Fetch repositories for a single GitHub user.
   *
   * Scrapes user's GitHub profile to get repo list, then uses
   * existing scraper to get details for each repo.
   *
   * @param username - GitHub username
   * @returns Promise resolving to array of repositories
   * @private
   */
  private async fetchUserRepos(username: string): Promise<GitHubRepo[]> {
    // Scrape user's repositories tab to get list of repo URLs
    const repoUrls = await this.scrapeUserRepoList(username);

    // Limit repos if configured
    const urlsToFetch = this.config.maxReposPerAccount && this.config.maxReposPerAccount > 0
      ? repoUrls.slice(0, this.config.maxReposPerAccount)
      : repoUrls;

    // Use EXISTING scraper to get details for each repo
    const repos: GitHubRepo[] = [];

    for (const url of urlsToFetch) {
      try {
        // USE EXISTING SCRAPER - DO NOT MODIFY
        const repoInfo = await getCompleteRepoInfo(url);

        if (repoInfo) {
          // Map existing data to GitHubRepo type
          repos.push(this.mapRepoInfoToGitHubRepo(repoInfo));
        }
      } catch (error) {
        console.error(`Failed to fetch ${url}:`, error);
        // Continue with other repos
      }
    }

    return repos;
  }

  /**
   * Scrape user's GitHub profile to get list of repository URLs.
   *
   * @param username - GitHub username
   * @returns Promise resolving to array of repo URLs
   * @private
   */
  private async scrapeUserRepoList(username: string): Promise<string[]> {
    try {
      const profileUrl = `https://github.com/${username}?tab=repositories`;

      const response = await fetch(profileUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const html = await response.text();

      // Extract repo links using regex (simple pattern matching)
      const repoPattern = new RegExp(`href="/(${username}/[^"]+)"[^>]*itemprop="name codeRepository"`, 'g');
      const matches = [...html.matchAll(repoPattern)];

      const repoUrls = matches
        .map(match => `https://github.com/${match[1]}`)
        .filter((url, index, self) => self.indexOf(url) === index); // Remove duplicates

      return repoUrls;
    } catch (error) {
      console.error(`Error scraping repo list for ${username}:`, error);
      return [];
    }
  }

  /**
   * Map existing scraper's RepoInfo to GitHubRepo type.
   *
   * DATA TRANSFORMATION ONLY - does not modify scraping logic.
   * Uses whatever data the existing scraper already provides.
   *
   * @param repoInfo - Data from existing scraper
   * @returns Mapped GitHubRepo object
   * @private
   */
  private mapRepoInfoToGitHubRepo(repoInfo: RepoInfo): GitHubRepo {
    return {
      // Use existing data as-is
      owner: repoInfo.owner,
      name: repoInfo.name,
      fullName: repoInfo.fullName,
      url: repoInfo.url,
      description: repoInfo.description,
      language: repoInfo.language,
      stars: repoInfo.stars,
      forks: repoInfo.forks,
      lastUpdated: repoInfo.lastUpdated,
      readme: repoInfo.readme,
    };
  }

  /**
   * Extract metadata from GitHub repo and map to Project schema.
   *
   * USES EXISTING DATA ONLY - does not add new extraction logic.
   * Maps whatever the existing scraper already provides.
   *
   * @param repo - GitHub repository data
   * @returns Partial project data ready for categorization
   *
   * @example
   * ```typescript
   * const partialProject = adapter.extractMetadata(repo);
   * // Use with auto-categorizer to determine category
   * ```
   */
  extractMetadata(repo: GitHubRepo): Omit<CreateProjectData, 'category'> {
    // Create slug from repo name
    const slug = this.createSlug(repo.name);

    return {
      // Use existing data as-is (no new extraction)
      slug,
      title: repo.name, // Use repo name as title
      description: repo.description ?? null,
      source: 'github' as const,

      // GitHub-specific fields (existing data)
      github_url: repo.url,
      github_owner: repo.owner,
      github_repo: repo.name,
      stars: repo.stars ?? null,
      language: repo.language ?? null,

      // Common metadata (existing data)
      tech_stack: repo.language ? [repo.language] : null, // Simple tech stack from language
      homepage_url: repo.url, // Use GitHub URL as homepage
      readme_content: repo.readme ?? null,

      // Manual upload fields (null for GitHub source)
      manual_screenshot_url: null,
      manual_images: null,
      install_command: null, // Will be set by aggregator if Homebrew detected

      // Sync timestamp
      last_synced_at: new Date(),
    };
  }

  /**
   * Create URL-friendly slug from repository name.
   *
   * @param name - Repository name
   * @returns URL-friendly slug
   * @private
   */
  private createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
}

/**
 * Create a GitHub adapter with default configuration.
 *
 * Configured for WillyV3's GitHub accounts.
 *
 * @returns Configured GitHubAdapter instance
 *
 * @example
 * ```typescript
 * const adapter = createDefaultGitHubAdapter();
 * const repos = await adapter.fetchAllRepos();
 * ```
 */
export function createDefaultGitHubAdapter(): GitHubAdapter {
  return new GitHubAdapter({
    accounts: [
      'willyv3',
      // Add your main GitHub account here if different
    ],
    maxReposPerAccount: 100, // Reasonable limit
  });
}
