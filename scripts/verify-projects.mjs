/**
 * Verify imported projects
 */

import pg from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
try {
  const envPath = join(__dirname, '..', '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');

  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value.trim();
      }
    }
  });
} catch (error) {
  console.warn('⚠️  Could not load .env.local file:', error.message);
}

async function verifyProjects() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN source = 'manual' THEN 1 END) as manual,
        COUNT(CASE WHEN source = 'github' THEN 1 END) as github,
        COUNT(CASE WHEN manual_screenshot_url IS NOT NULL THEN 1 END) as with_screenshots,
        COUNT(CASE WHEN manual_screenshot_url IS NULL THEN 1 END) as without_screenshots,
        COUNT(CASE WHEN github_url IS NOT NULL THEN 1 END) as with_github_url,
        COUNT(CASE WHEN homepage_url IS NOT NULL THEN 1 END) as with_homepage_url
      FROM projects
    `);

    console.log('\n📊 Projects Database Summary:');
    console.log(`   Total projects: ${result.rows[0].total}`);
    console.log(`   Manual source: ${result.rows[0].manual}`);
    console.log(`   GitHub source: ${result.rows[0].github}`);
    console.log(`   With screenshots: ${result.rows[0].with_screenshots}`);
    console.log(`   Without screenshots: ${result.rows[0].without_screenshots}`);
    console.log(`   With GitHub URL: ${result.rows[0].with_github_url}`);
    console.log(`   With Homepage URL: ${result.rows[0].with_homepage_url}`);

    // Show sample projects
    const sampleResult = await pool.query(`
      SELECT slug, title, category,
             CASE WHEN manual_screenshot_url IS NOT NULL THEN '✓' ELSE '✗' END as screenshot,
             CASE WHEN github_url IS NOT NULL THEN '✓' ELSE '✗' END as github,
             CASE WHEN homepage_url IS NOT NULL THEN '✓' ELSE '✗' END as homepage
      FROM projects
      ORDER BY created_at DESC
      LIMIT 10
    `);

    console.log('\n📋 Sample Projects (most recent):');
    console.log('┌─────────────────────────────┬───────────┬────────────┬────────┬────────┐');
    console.log('│ Slug                        │ Category  │ Screenshot │ GitHub │ Home   │');
    console.log('├─────────────────────────────┼───────────┼────────────┼────────┼────────┤');
    sampleResult.rows.forEach(row => {
      const slug = row.slug.padEnd(27);
      const category = row.category.padEnd(9);
      console.log(`│ ${slug} │ ${category} │     ${row.screenshot}      │   ${row.github}    │   ${row.homepage}    │`);
    });
    console.log('└─────────────────────────────┴───────────┴────────────┴────────┴────────┘');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

verifyProjects();
