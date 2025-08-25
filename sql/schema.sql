-- WillyV3's Homelab Blog Database Schema
-- Complete PostgreSQL schema for the blog with comments system
-- This schema supports unlimited comment threading with likes

-- Enable UUID extension for better primary keys (optional, but recommended)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Posts table for admin-created blog posts
-- Note: MDX files in /src/content/posts/ are the primary content source
-- This table is for admin UI posts only
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category VARCHAR(100),
    tags TEXT[], -- PostgreSQL array for tags
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table with unlimited threading support
-- Each comment can have a parent_id for nested replies
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_slug VARCHAR(255) NOT NULL, -- References the blog post slug (works for both MDX and DB posts)
    clerk_user_id VARCHAR(255) NOT NULL, -- Clerk authentication user ID
    username VARCHAR(100) NOT NULL, -- Display name from Clerk
    content TEXT NOT NULL,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE, -- For threading, NULL = top-level comment
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comment likes table for like/unlike functionality
-- One like per user per comment
CREATE TABLE IF NOT EXISTS comment_likes (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    clerk_user_id VARCHAR(255) NOT NULL, -- Clerk user who liked the comment
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate likes from same user on same comment
    UNIQUE(comment_id, clerk_user_id)
);

-- Indexes for better performance

-- Posts table indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_created ON posts(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags); -- GIN index for array searching

-- Comments table indexes
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_clerk_user ON comments(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_parent ON comments(post_slug, parent_id); -- Composite for thread queries

-- Comment likes indexes
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user ON comment_likes(clerk_user_id);

-- Triggers for automatic timestamp updates

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for posts table
CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for comments table
CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional, for testing)
-- Uncomment to insert sample data

/*
-- Sample post (optional)
INSERT INTO posts (title, slug, content, excerpt, category, tags, published) VALUES
(
    'Welcome to the Homelab',
    'welcome-to-homelab',
    '# Welcome to my homelab blog\n\nThis is where I document breaking stuff and fixing it.',
    'First post about homelab adventures',
    'infrastructure',
    ARRAY['homelab', 'introduction'],
    true
) ON CONFLICT (slug) DO NOTHING;

-- Sample comments (optional)
INSERT INTO comments (post_slug, clerk_user_id, username, content) VALUES
(
    'welcome-to-homelab',
    'user_sample123',
    'TestUser',
    'Great first post! Looking forward to more homelab content.'
) ON CONFLICT DO NOTHING;
*/

-- Useful queries for development/debugging

-- Get all comments for a post with like counts
/*
SELECT 
    c.*,
    COUNT(cl.id) as like_count,
    EXISTS(
        SELECT 1 FROM comment_likes cl2 
        WHERE cl2.comment_id = c.id 
        AND cl2.clerk_user_id = 'current_user_id'
    ) as user_has_liked
FROM comments c
LEFT JOIN comment_likes cl ON c.id = cl.comment_id
WHERE c.post_slug = 'your-post-slug'
GROUP BY c.id
ORDER BY c.created_at ASC;
*/

-- Get comment thread structure
/*
WITH RECURSIVE comment_tree AS (
    -- Base case: top-level comments
    SELECT 
        id, post_slug, clerk_user_id, username, content, 
        parent_id, created_at, 0 as depth, 
        ARRAY[id] as path
    FROM comments 
    WHERE parent_id IS NULL AND post_slug = 'your-post-slug'
    
    UNION ALL
    
    -- Recursive case: replies
    SELECT 
        c.id, c.post_slug, c.clerk_user_id, c.username, c.content,
        c.parent_id, c.created_at, ct.depth + 1,
        ct.path || c.id
    FROM comments c
    JOIN comment_tree ct ON c.parent_id = ct.id
    WHERE ct.depth < 10 -- Prevent infinite recursion
)
SELECT * FROM comment_tree ORDER BY path;
*/