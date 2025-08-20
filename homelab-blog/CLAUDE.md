# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is WillyV3's homelab blog - a Next.js 15 application with MDX blog posts, Clerk authentication, and Neon PostgreSQL comments system. The blog uses a "doom-64" retro gaming theme with shadcn/ui components and focuses on real homelab infrastructure stories.

## Commands

### Development
```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture

### Content Management
- **Blog posts**: Located in `/src/content/posts/` as `.mdx` files
- **Post structure**: Uses gray-matter frontmatter with title, date, category, tags, excerpt
- **Content processing**: `src/lib/posts.ts` handles MDX parsing and metadata extraction
- **MDX components**: Custom React components available in blog posts via imports

### Authentication & Comments
- **Auth provider**: Clerk for user authentication
- **Database**: Neon PostgreSQL for comments storage
- **Comments API**: REST endpoints in `/src/app/api/comments/`
- **Database interface**: `src/lib/db.ts` with TypeScript interfaces for Comment and CommentLike

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 + shadcn/ui components with doom-64 theme
- **Components**: Organized in `/src/components/` with ui/, blog/, and comments/ subdirectories
- **Navigation**: Site-wide navigation component handles routing

### Key Files
- `src/app/layout.tsx` - Root layout with Clerk provider and site metadata
- `src/app/blog/[slug]/page.tsx` - Dynamic blog post pages
- `src/components/blog/MDXComponents.tsx` - Custom MDX component mappings
- `src/lib/posts.ts` - Core blog post utilities and interfaces
- `src/lib/db.ts` - Database connection and comment interfaces

## Blog Post Creation

### Frontmatter Structure
```yaml
---
title: "Post Title"
date: "2025-08-19"
category: "infrastructure" 
tags: ["homelab", "automation", "claude-code"]
excerpt: "Brief description for SEO and cards"
---
```

### MDX Features
- Import and use shadcn/ui components directly in posts
- Code syntax highlighting via rehype-highlight
- GitHub Flavored Markdown via remark-gfm
- Custom MDX components for enhanced formatting

### Content Location
- Posts go in `/src/content/posts/` as `.mdx` files
- Filename becomes the URL slug
- Posts automatically appear in blog index and RSS feed

## Environment Variables Required

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Neon PostgreSQL
DATABASE_URL=postgresql://...
```

## Deployment Notes

- Optimized for Vercel deployment
- Includes comprehensive SEO metadata and sitemap generation
- RSS feed auto-generated at `/feed.xml`
- Static assets in `/public/` directory