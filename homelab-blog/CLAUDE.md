# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is WillyV3's homelab blog - a Next.js 15 application with MDX blog posts, Clerk authentication, and Neon PostgreSQL comments system. The blog uses a "doom-64" retro gaming theme with shadcn/ui components and virtue custom font for headings. Focuses on real homelab infrastructure stories with unlimited depth comment threading.

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

# Rebuild native dependencies (for Tailwind CSS v4 issues)
npm run postinstall
```

## Architecture

### Content Management
- **Blog posts**: Located in `/src/content/posts/` as `.mdx` files
- **Post structure**: Uses gray-matter frontmatter with title, date, category, tags, excerpt
- **Content processing**: `src/lib/posts.ts` handles MDX parsing and metadata extraction
- **MDX components**: Custom React components available in blog posts via imports

### Authentication & Comments
- **Auth provider**: Clerk for user authentication
- **Database**: Neon PostgreSQL for comments storage with unlimited depth threading
- **Comments API**: REST endpoints in `/src/app/api/comments/` with recursive tree building
- **Database interface**: `src/lib/db.ts` with TypeScript interfaces for Comment and CommentLike
- **Threading**: Comments support unlimited nesting with visual depth limit of 3 levels

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 + shadcn/ui components with doom-64 theme
- **Fonts**: Virtue font for headings/branding, system fonts for body text
- **Components**: Organized in `/src/components/` with ui/, blog/, and comments/ subdirectories
- **Navigation**: Site-wide navigation component with virtue font styling

### Key Files
- `src/app/layout.tsx` - Root layout with Clerk provider, virtue font loading, and site metadata
- `src/app/page.tsx` - Homepage with virtue font applied to key headings
- `src/app/blog/[slug]/page.tsx` - Dynamic blog post pages
- `src/components/blog/BlogLayout.tsx` - Blog post layout with virtue font titles
- `src/components/blog/BlogCard.tsx` - Post preview cards with virtue font titles
- `src/components/Navigation.tsx` - Site navigation with virtue font branding
- `src/components/comments/CommentsList.tsx` - Recursive comment threading with depth management
- `src/components/comments/CommentSection.tsx` - Comment management with tree state handling
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

## Font System

### Virtue Font (Custom)
- **Location**: `/public/virtue.ttf`
- **Usage**: Applied to headings, titles, navigation branding, and Clerk UI
- **Implementation**: Loaded via Next.js `localFont` with `--font-virtue` CSS variable
- **Classes**: Use `font-virtue` Tailwind class for selective application

### System Fonts
- **Usage**: Body text, UI elements, general content
- **Implementation**: Clean system font stack (ui-sans-serif, system-ui, sans-serif)

## Comment Threading System

### Database Schema
- **Table**: `comments` with `parent_id` foreign key for threading
- **Depth**: Unlimited database nesting supported
- **Constraints**: Foreign key cascade delete for clean thread removal

### Frontend Implementation
- **Visual Depth**: Limited to 3 levels for UI clarity
- **Recursive Rendering**: Full thread structure maintained in memory
- **State Management**: Single reply form active at a time across entire thread
- **Tree Building**: Recursive `buildRepliesTree` function in API route

## Tailwind CSS v4 Setup

### Configuration
- **Version**: Tailwind CSS v4 with `@tailwindcss/postcss`
- **PostCSS**: Uses `@theme inline` syntax for CSS variables
- **Colors**: OKLCH color format for doom-64 theme
- **Native Dependencies**: Requires lightningcss rebuild on deployment

### Vercel Deployment
- **Build Issues**: Native binary conflicts with lightningcss
- **Solution**: Postinstall script rebuilds lightningcss with `--foreground-scripts`
- **Config**: `vercel.json` forces install with legacy peer deps

## Deployment Notes

- **Platform**: Optimized for Vercel deployment with custom build process
- **Dependencies**: Uses `--legacy-peer-deps --force` for package compatibility
- **Build Process**: Includes postinstall script for native binary rebuilding
- **SEO**: Comprehensive metadata and sitemap generation
- **RSS**: Auto-generated feed at `/feed.xml`
- **Assets**: Static files in `/public/` including virtue.ttf font