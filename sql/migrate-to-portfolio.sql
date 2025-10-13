-- Portfolio Migration Script
-- Transform blog database to portfolio database
-- SAFE: Keeps posts table, adds projects table
-- Date: 2025-10-07

-- ============================================
-- SAFETY CHECK: Document current state
-- ============================================
-- Before running, verify tables with:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- ============================================
-- STEP 1: Drop comment system (not needed for portfolio)
-- ============================================

-- Drop comment_likes table (has foreign key to comments)
DROP TABLE IF EXISTS comment_likes CASCADE;

-- Drop comments table
DROP TABLE IF EXISTS comments CASCADE;

-- ============================================
-- STEP 2: Keep posts table (no conflict with projects)
-- ============================================
-- Blog posts table remains untouched
-- Portfolio uses 'projects' table - different name, different purpose

-- ============================================
-- STEP 3: Create projects table for portfolio
-- ============================================

CREATE TABLE IF NOT EXISTS projects (
    -- Core fields
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- TUI, Web, CLI, Python, OSS
    source VARCHAR(20) NOT NULL, -- 'github' or 'manual'

    -- GitHub metadata (for github source)
    github_url VARCHAR(500),
    github_owner VARCHAR(255),
    github_repo VARCHAR(255),
    stars INTEGER DEFAULT 0,
    language VARCHAR(50),

    -- Manual upload metadata (for manual source)
    manual_screenshot_url TEXT, -- Vercel Blob URL
    manual_images TEXT[], -- Array of Vercel Blob URLs

    -- Common metadata (both sources)
    tech_stack TEXT[], -- ['Go', 'Bubble Tea', 'Charm']
    homepage_url VARCHAR(500),
    install_command TEXT, -- e.g., brew install willyv3/tap/nextui
    readme_content TEXT,

    -- Caching and timestamps
    last_synced_at TIMESTAMP WITH TIME ZONE, -- Last GitHub sync
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 4: Create indexes for performance
-- ============================================

-- Index for filtering by category
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- Index for filtering by source (github/manual)
CREATE INDEX IF NOT EXISTS idx_projects_source ON projects(source);

-- Index for slug lookups (detail pages)
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Index for recent projects queries
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Index for GitHub projects (filtering)
CREATE INDEX IF NOT EXISTS idx_projects_github_owner ON projects(github_owner)
    WHERE source = 'github';

-- GIN index for tech_stack array searching
CREATE INDEX IF NOT EXISTS idx_projects_tech_stack ON projects USING GIN(tech_stack);

-- ============================================
-- STEP 5: Add trigger for auto-updating updated_at
-- ============================================

-- Reuse existing update_updated_at_column function (already exists from schema.sql)
-- If function doesn't exist, create it:
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for projects table
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- After migration, verify with:
/*
-- List all tables (should see: posts, projects)
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Describe projects table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'projects';

-- Verify posts table still exists
SELECT COUNT(*) FROM posts;
*/

-- ============================================
-- ROLLBACK PLAN (if needed)
-- ============================================
-- Neon provides point-in-time recovery
-- To rollback:
-- 1. Go to Neon dashboard
-- 2. Select "Restore" for your database
-- 3. Choose timestamp before this migration
-- 4. Create new branch from restore point

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Tables:
-- ✅ projects (NEW - portfolio projects)
-- ✅ posts (KEPT - old blog posts)
-- ❌ comments (DROPPED - not needed)
-- ❌ comment_likes (DROPPED - not needed)
