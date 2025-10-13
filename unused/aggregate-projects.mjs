/**
 * Build-time GitHub project aggregation script.
 *
 * Fetches repositories from configured GitHub accounts, categorizes them,
 * and stores in database before Next.js build.
 *
 * Usage: node scripts/aggregate-projects.mjs
 */

import pkg from 'pg';
const { Pool } = pkg;

/**
 * Note: This script runs BEFORE TypeScript compilation, so we cannot
 * import from the TypeScript codebase. Instead, we inline the essential
 * logic needed for build-time aggregation.
 *
 * The full TypeScript implementation in src/lib/aggregation is used
 * for runtime operations (admin dashboard, API routes, etc.)
 */

// GitHub accounts to scrape
const GITHUB_ACCOUNTS = ['WillyV3'];

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Fetch user's GitHub repositories.
 */
async function fetchUserRepos(username) {
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

    // Extract repo links
    const repoPattern = new RegExp(`href="/(${username}/[^"]+)"[^>]*itemprop="name codeRepository"`, 'g');
    const matches = [...html.matchAll(repoPattern)];

    const repoUrls = matches
      .map(match => `https://github.com/${match[1]}`)
      .filter((url, index, self) => self.indexOf(url) === index);

    console.log(`  Found ${repoUrls.length} repositories for ${username}`);
    return repoUrls;
  } catch (error) {
    console.error(`Error fetching repos for ${username}:`, error);
    return [];
  }
}

/**
 * Scrape basic repo info (simplified from src/lib/webutils.ts).
 */
async function scrapeRepoInfo(url) {
  try {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;

    const owner = match[1];
    const name = match[2];

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return { owner, name, url, fullName: `${owner}/${name}` };
    }

    const html = await response.text();

    // Extract description
    const descMatch = html.match(/<meta property="og:description" content="([^"]*)"/);
    const description = descMatch ? descMatch[1].trim() : null;

    // Extract language
    const langMatch = html.match(/<span[^>]*itemprop="programmingLanguage"[^>]*>([^<]+)</);
    const language = langMatch ? langMatch[1].trim() : null;

    // Extract stars
    const starMatch = html.match(/id="repo-stars-counter-star"[^>]*>([^<]+)</);
    const stars = starMatch ? parseInt(starMatch[1].replace(/,/g, '')) : null;

    return {
      owner,
      name,
      fullName: `${owner}/${name}`,
      url,
      description,
      language,
      stars,
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
}

/**
 * Simple categorization based on language and description.
 */
function categorizeProject(repo) {
  const desc = (repo.description || '').toLowerCase();
  const lang = (repo.language || '').toLowerCase();

  // TUI detection
  if (desc.includes('bubbletea') || desc.includes('bubble tea') ||
      desc.includes('charm') || desc.includes('tui') ||
      desc.includes('terminal ui')) {
    return 'TUI';
  }

  // Web detection
  if (desc.includes('next.js') || desc.includes('nextjs') ||
      desc.includes('react') || desc.includes('web app') ||
      lang === 'typescript' || lang === 'javascript') {
    return 'Web';
  }

  // Python detection
  if (lang === 'python') {
    return 'Python';
  }

  // CLI detection (Go or has CLI keywords)
  if (lang === 'go' || desc.includes('cli') || desc.includes('command line')) {
    return 'CLI';
  }

  // Default
  return 'CLI';
}

/**
 * Create slug from repo name.
 */
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Main aggregation function.
 */
async function aggregateProjects() {
  console.log('🚀 Starting GitHub project aggregation...');

  if (!process.env.DATABASE_URL) {
    console.log('⚠️  No DATABASE_URL found, skipping aggregation');
    return;
  }

  let totalCreated = 0;
  let totalUpdated = 0;
  let totalErrors = 0;

  try {
    // Fetch all repos from configured accounts
    const allRepoUrls = [];
    for (const account of GITHUB_ACCOUNTS) {
      console.log(`\n📦 Fetching repositories for ${account}...`);
      const urls = await fetchUserRepos(account);
      allRepoUrls.push(...urls);
    }

    console.log(`\n✓ Found ${allRepoUrls.length} total repositories`);

    // Process each repo
    for (const url of allRepoUrls) {
      try {
        const repo = await scrapeRepoInfo(url);
        if (!repo) {
          totalErrors++;
          continue;
        }

        console.log(`\n  Processing: ${repo.fullName}`);

        const slug = createSlug(repo.name);
        const category = categorizeProject(repo);

        console.log(`    Category: ${category}`);

        // Check if project exists
        const existingResult = await pool.query(
          'SELECT id FROM projects WHERE slug = $1 LIMIT 1',
          [slug]
        );

        if (existingResult.rows.length > 0) {
          // Update existing
          await pool.query(
            `UPDATE projects SET
              title = $1,
              description = $2,
              category = $3,
              github_url = $4,
              github_owner = $5,
              github_repo = $6,
              stars = $7,
              language = $8,
              tech_stack = $9,
              last_synced_at = NOW(),
              updated_at = NOW()
            WHERE slug = $10`,
            [
              repo.name,
              repo.description,
              category,
              repo.url,
              repo.owner,
              repo.name,
              repo.stars,
              repo.language,
              repo.language ? [repo.language] : null,
              slug,
            ]
          );
          totalUpdated++;
          console.log(`    ✓ Updated`);
        } else {
          // Create new
          await pool.query(
            `INSERT INTO projects (
              slug, title, description, category, source,
              github_url, github_owner, github_repo, stars, language,
              tech_stack, homepage_url, last_synced_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())`,
            [
              slug,
              repo.name,
              repo.description,
              category,
              'github',
              repo.url,
              repo.owner,
              repo.name,
              repo.stars,
              repo.language,
              repo.language ? [repo.language] : null,
              repo.url,
            ]
          );
          totalCreated++;
          console.log(`    ✓ Created`);
        }
      } catch (error) {
        totalErrors++;
        console.error(`    ✗ Error:`, error.message);
      }
    }

    console.log('\n✅ Aggregation complete!');
    console.log(`   Created: ${totalCreated}`);
    console.log(`   Updated: ${totalUpdated}`);
    console.log(`   Errors: ${totalErrors}`);

  } catch (error) {
    console.error('❌ Fatal error during aggregation:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run aggregation
aggregateProjects();
