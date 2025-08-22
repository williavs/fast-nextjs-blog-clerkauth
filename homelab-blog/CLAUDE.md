# CLAUDE.md

This file provides comprehensive guidance to Claude Code when working with WillyV3's homelab blog - a Next.js 15 application with MDX blog posts, Clerk authentication, and Neon PostgreSQL comments system.

## Project Overview

This is WillyV3's homelab blog - a Next.js 15 application with MDX blog posts, Clerk authentication, and Neon PostgreSQL comments system. The blog uses a "doom-64" retro gaming theme with shadcn/ui components and focuses on real homelab infrastructure stories.

## Core Development Philosophy

### KISS (Keep It Simple, Stupid)
Simplicity should be a key goal in design. Choose straightforward solutions over complex ones whenever possible. Simple solutions are easier to understand, maintain, and debug.

### YAGNI (You Aren't Gonna Need It)
Avoid building functionality on speculation. Implement features only when they are needed, not when you anticipate they might be useful in the future.

### Design Principles
- **Dependency Inversion**: High-level modules should not depend on low-level modules. Both should depend on abstractions.
- **Open/Closed Principle**: Software entities should be open for extension but closed for modification.
- **Vertical Slice Architecture**: Organize by features, not layers
- **Component-First**: Build with reusable, composable components with single responsibility
- **Fail Fast**: Validate inputs early, throw errors immediately

## 🤖 AI Assistant Guidelines

### Context Awareness
- When implementing features, always check existing patterns first
- Prefer composition over inheritance in all designs
- Use existing utilities before creating new ones
- Check for similar functionality in other domains/features

### Common Pitfalls to Avoid
- Creating duplicate functionality
- Overwriting existing tests
- Modifying core frameworks without explicit instruction
- Adding dependencies without checking existing alternatives

### Workflow Patterns
- Preferably create tests BEFORE implementation (TDD)
- Use "think hard" for architecture decisions
- Break complex tasks into smaller, testable units
- Validate understanding before implementation

### Search Command Requirements
**CRITICAL**: Always use `rg` (ripgrep) instead of traditional `grep` and `find` commands:

```bash
# ❌ Don't use grep
grep -r "pattern" .

# ✅ Use rg instead
rg "pattern"

# ❌ Don't use find with name
find . -name "*.tsx"

# ✅ Use rg with file filtering
rg --files | rg "\.tsx$"
# or
rg --files -g "*.tsx"
```

## 🧱 Code Structure & Modularity

### File and Component Limits
- **Never create a file longer than 500 lines of code.** If approaching this limit, refactor by splitting into modules or helper files.
- **Components should be under 200 lines** for better maintainability.
- **Functions should be short and focused sub 50 lines** and have a single responsibility.
- **Organize code into clearly separated modules**, grouped by feature or responsibility.

## 🚀 Next.js 15 & React 19 Key Features

### Next.js 15 Core Features
- **Turbopack**: Fast bundler for development (stable)
- **App Router**: File-system based router with layouts and nested routing
- **Server Components**: React Server Components for performance
- **Server Actions**: Type-safe server functions
- **Parallel Routes**: Concurrent rendering of multiple pages
- **Intercepting Routes**: Modal-like experiences

### React 19 Features
- **React Compiler**: Eliminates need for `useMemo`, `useCallback`, and `React.memo`
- **Actions**: Handle async operations with built-in pending states
- **use() API**: Simplified data fetching and context consumption
- **Document Metadata**: Native support for SEO tags
- **Enhanced Suspense**: Better loading states and error boundaries

### TypeScript Integration (MANDATORY)
- **MUST use `ReactElement` instead of `JSX.Element`** for return types
- **MUST import types from 'react'** explicitly
- **NEVER use `JSX.Element` namespace** - use React types directly

```typescript
// ✅ CORRECT: Modern React 19 typing
import { ReactElement } from 'react';

function MyComponent(): ReactElement {
  return <div>Content</div>;
}

// ❌ FORBIDDEN: Legacy JSX namespace
function MyComponent(): JSX.Element {  // Cannot find namespace 'JSX'
  return <div>Content</div>;
}
```

## 🏗️ Project Structure

### Current Architecture
```
src/
├── app/                   # Next.js App Router
│   ├── blog/              # Blog routes
│   │   └── [slug]/        # Dynamic blog post pages
│   ├── api/               # API routes
│   │   └── comments/      # Comments API endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with Clerk provider
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # shadcn/ui base components
│   ├── blog/              # Blog-specific components
│   │   └── MDXComponents.tsx # Custom MDX mappings
│   └── comments/          # Comment system components
├── content/               # Blog content
│   └── posts/             # MDX blog posts
├── lib/                   # Core utilities
│   ├── posts.ts           # Blog post utilities
│   ├── db.ts              # Database interface
│   └── utils.ts           # Utility functions
└── types/                 # TypeScript type definitions
```

## 🎯 TypeScript Configuration (STRICT REQUIREMENTS)

### MUST Follow These Compiler Options
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### MANDATORY Type Requirements
- **NEVER use `any` type** - use `unknown` if type is truly unknown
- **MUST have explicit return types** for all functions and components
- **MUST use proper generic constraints** for reusable components
- **NEVER use `@ts-ignore`** or `@ts-expect-error` - fix the type issue properly

## 📦 Current Dependencies

### Core Stack
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **shadcn/ui** for components
- **MDX** for blog content
- **Clerk** for authentication
- **Neon PostgreSQL** for comments
- **Vercel** for deployment

## Blog Post Management

### Content Structure
- **Location**: `/src/content/posts/` as `.mdx` files
- **Filename**: Becomes the URL slug
- **Processing**: `src/lib/posts.ts` handles MDX parsing and metadata

### Frontmatter Format
```yaml
---
title: "Post Title"
date: "2025-08-19"
category: "infrastructure" | "automation" | "networking" | "debugging"
tags: ["homelab", "automation", "claude-code"]
excerpt: "Brief description for SEO and cards"
---
```

### MDX Features
- Import and use shadcn/ui components directly in posts
- Code syntax highlighting via rehype-highlight
- GitHub Flavored Markdown via remark-gfm
- Custom MDX components for enhanced formatting

## Authentication & Database

### Clerk Integration
- Root layout includes Clerk provider
- User authentication for comment system
- Environment variables: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

### Neon PostgreSQL
- Comments storage with TypeScript interfaces
- Database interface in `src/lib/db.ts`
- Comment and CommentLike models
- Environment variable: `DATABASE_URL`

## 🛡️ Data Validation (MANDATORY FOR ALL EXTERNAL DATA)

### MUST Follow These Validation Rules
- **MUST validate ALL external data**: API responses, form inputs, URL params, environment variables
- **MUST use branded types**: For all IDs and domain-specific values
- **MUST fail fast**: Validate at system boundaries, throw errors immediately

### Environment Validation Example
```typescript
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

## 🧪 Testing Strategy

### Testing Standards
- **MINIMUM 80% code coverage** for new features
- **MUST co-locate tests** with components in `__tests__` folders
- **MUST use React Testing Library** for component tests
- **MUST test user behavior** not implementation details

## 🎨 Component Guidelines

### Shadcn/UI Pattern
Follow existing shadcn/ui component patterns in `/src/components/ui/`. Use class-variance-authority for variant management and maintain consistent styling with the doom-64 theme.

### MDX Components
Custom components for blog posts are defined in `/src/components/blog/MDXComponents.tsx`. Always extend this file when adding new MDX capabilities.

## 🔐 Security Requirements

### Input Validation
- **MUST sanitize ALL user inputs** before processing
- **MUST validate comment content** before database insertion
- **MUST prevent XSS** with proper escaping
- **NEVER use dangerouslySetInnerHTML** without sanitization

## 🚀 Performance Guidelines

### Next.js 15 Optimizations
- **Use Server Components** by default for blog content
- **Client Components** only for interactive elements (comments, auth)
- **Dynamic imports** for heavy components
- **Image optimization** with next/image for blog assets

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production  
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

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

## ⚠️ CRITICAL GUIDELINES (MUST FOLLOW ALL)

1. **ENFORCE strict TypeScript** - ZERO compromises on type safety
2. **VALIDATE everything external** - Comments, user input, environment variables
3. **MAINTAIN doom-64 theme** - Don't break existing visual consistency
4. **PRESERVE MDX functionality** - Blog posts must render correctly
5. **MAXIMUM 500 lines per file** - Split if larger
6. **MAXIMUM 200 lines per component** - Refactor if larger
7. **MUST handle ALL states** - Loading, error, empty, and success
8. **MUST write complete JSDoc** - ALL exports must be documented
9. **NEVER use `any` type** - Use proper typing or `unknown`
10. **MUST pass ALL automated checks** - Before ANY merge

## 📋 Pre-commit Checklist

- [ ] TypeScript compiles with ZERO errors
- [ ] ESLint passes with ZERO warnings
- [ ] Blog posts render correctly in MDX
- [ ] Comment system functions properly
- [ ] Authentication flow works with Clerk
- [ ] Database queries are properly typed
- [ ] All new components follow shadcn/ui patterns
- [ ] doom-64 theme consistency maintained
- [ ] Environment variables validated
- [ ] No console.log statements in production code

### FORBIDDEN Practices
- **NEVER use `any` type**
- **NEVER ignore TypeScript errors** with `@ts-ignore`
- **NEVER trust external data** without validation
- **NEVER use `JSX.Element`** - use `ReactElement` instead
- **NEVER break existing blog functionality**
- **NEVER compromise the doom-64 theme**
- **NEVER skip proper error handling**

---

*This guide is optimized for WillyV3's homelab blog using Next.js 15 with React 19.*
*Focus on type safety, performance, and maintaining existing functionality.*
*Last updated: August 2025*