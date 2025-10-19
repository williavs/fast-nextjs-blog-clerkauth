
<!-- TIMESTAMP-START-DO-NOT-EDIT -->
# 🚨 CRITICAL TEMPORAL AWARENESS UPDATE 🚨

## MANDATORY DATE/TIME RECOGNITION - READ THIS FIRST!

**CURRENT ACTUAL DATE AND TIME:**
- **TODAY IS: Sunday, October 19, 2025**
- **CURRENT DATE: 2025-10-19**
- **CURRENT TIME: 09:49:36 **
- **THE YEAR IS: 2025**
- **IT IS NOT 2024! IT IS 2025!**

### ENFORCEMENT PROTOCOL:
1. **ALWAYS use 2025 when referencing current year**
2. **When using WebSearch, ALWAYS include "2025" or "2025" in queries for recent content**
3. **NEVER default to 2024 - that was last year**
4. **If you think it's 2024, YOU ARE WRONG - check this header again**

### Examples of CORRECT date usage:
- "The latest docs from 2025"
- "Recent updates in August 2025"
- "Current 2025 best practices"

### VIOLATION ALERT:
Using 2024 for current events = TEMPORAL CONFUSION = FAILURE

**Last Updated: 2025-10-19 09:49:36**
<!-- TIMESTAMP-END-DO-NOT-EDIT -->

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

## Hybrid Content System (CRITICAL)

### Content Architecture
- **MDX Posts**: Claude-generated content stored as files in `/src/content/posts/`
- **Database Posts**: Admin UI posts stored in Neon PostgreSQL `posts` table
- **Unified Interface**: Both systems use same `BlogPost` interface with `source` field
- **Public Display**: Seamlessly merged - audience sees no distinction
- **Admin Dashboard**: Shows both content types with visual source indicators

### Content Functions (ASYNC CRITICAL)
- **`getAllPosts()`**: ASYNC function - combines MDX + DB posts
- **`getPostBySlug(slug)`**: ASYNC function - checks MDX first, then DB
- **`getMdxPosts()`**: SYNC function - only MDX files
- **`getDatabasePosts(publishedOnly)`**: ASYNC function - only DB posts

### Build Integration
- **llms.txt Updates**: Auto-generated during build with `scripts/update-llms.mjs`
- **Sitemap**: Includes all content sources automatically
- **RSS Feed**: Unified feed from both content systems

## CRITICAL LINTING & TYPESCRIPT GUARDRAILS

### 🚨 ASYNC/AWAIT ENFORCEMENT
**NEVER** call async functions without `await` - this causes TypeScript build errors:

```typescript
// ❌ WRONG - Will cause build failure
const posts = getAllPosts() // Missing await!
posts.map() // Error: Promise has no map method

// ✅ CORRECT - Always await async functions
const posts = await getAllPosts() 
posts.map() // Works correctly
```

### 🚨 FUNCTION SIGNATURE REQUIREMENTS
When using async data fetching functions, ALL calling functions must be async:

```typescript
// ❌ WRONG - Sync function calling async
export default function Page() {
  const posts = await getAllPosts() // Error in sync function
}

// ✅ CORRECT - Async function for async calls
export default async function Page() {
  const posts = await getAllPosts() // Works
}
```

### 🚨 MDEditor PROPS VALIDATION
Always use correct MDEditor props to avoid build failures:

```typescript
// ❌ WRONG - Invalid prop names
<MDEditor dataColorMode="auto" data-color-mode="auto" />

// ✅ CORRECT - Valid prop format  
<MDEditor data-color-mode="light" />
```

### 🚨 API ROUTE PARAMS (Next.js 15)
Always use Promise-wrapped params in API routes:

```typescript
// ❌ WRONG - Direct destructuring (Next.js 14 style)
export async function GET(request, { params }: { params: { id: string } }) {
  const result = await query('SELECT * FROM posts WHERE id = $1', [params.id])
}

// ✅ CORRECT - Promise-wrapped params (Next.js 15)
export async function GET(request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await query('SELECT * FROM posts WHERE id = $1', [id])
}
```

### 🚨 UNUSED VARIABLE CLEANUP
Remove all unused variables to pass linting:

```typescript
// ❌ WRONG - Unused variables cause lint errors
const [published, setPublished] = useState(false) // Never used

// ✅ CORRECT - Only declare what you use
// Remove unused state entirely
```

### 🚨 MANDATORY PRE-BUILD CHECKS
Before ANY code changes, always verify:

1. **Async Function Usage**: All `getAllPosts()`, `getPostBySlug()` calls use `await`
2. **Function Signatures**: Calling functions are marked `async` when needed
3. **API Route Params**: Use `Promise<{}>` wrapper for route parameters
4. **Component Props**: Verify prop names match library expectations
5. **Variable Usage**: Remove any unused imports/variables

### 🚨 BUILD PROCESS VALIDATION
Always run these commands before completing work:

```bash
npm run lint          # Check for linting errors
npm run build         # Verify TypeScript compilation
```

**NEVER** commit code that fails these checks!

## Deployment Notes

- **Platform**: Optimized for Vercel deployment with custom build process
- **Dependencies**: Uses `--legacy-peer-deps --force` for package compatibility  
- **Build Process**: Includes postinstall script for native binary rebuilding
- **SEO**: Comprehensive metadata and sitemap generation
- **RSS**: Auto-generated feed at `/feed.xml`
- **Assets**: Static files in `/public/` including virtue.ttf font
- **Domain**: https://breakshit.blog (production URL)


# CLAUDE.md

This file provides comprehensive guidance to Claude Code when working with Next.js 15 applications with React 19 and TypeScript.

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

**Enforcement Rules:**
```
(
    r"^grep\b(?!.*\|)",
    "Use 'rg' (ripgrep) instead of 'grep' for better performance and features",
),
(
    r"^find\s+\S+\s+-name\b",
    "Use 'rg --files | rg pattern' or 'rg --files -g pattern' instead of 'find -name' for better performance",
),
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

## 🏗️ Project Structure (Vertical Slice Architecture)

```
src/
├── app/                   # Next.js App Router
│   ├── (routes)/          # Route groups
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Shared UI components
│   ├── ui/                # Base components (shadcn/ui)
│   └── common/            # Application-specific shared components
├── features/              # Feature-based modules (RECOMMENDED)
│   └── [feature]/
│       ├── __tests__/     # Co-located tests
│       ├── components/    # Feature components
│       ├── hooks/         # Feature-specific hooks
│       ├── api/           # API integration
│       ├── schemas/       # Zod validation schemas
│       ├── types/         # TypeScript types
│       └── index.ts       # Public API
├── lib/                   # Core utilities and configurations
│   ├── utils.ts           # Utility functions
│   ├── env.ts             # Environment validation
│   └── constants.ts       # Application constants
├── hooks/                 # Shared custom hooks
├── styles/                # Styling files
└── types/                 # Shared TypeScript types
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
- **MUST use type inference from Zod schemas** using `z.infer<typeof schema>`
- **NEVER use `@ts-ignore`** or `@ts-expect-error` - fix the type issue properly

## 📦 Package Management & Dependencies

### Essential Next.js 15 Dependencies
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "15.0.0",
    "prettier": "^3.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### Recommended Additional Dependencies
```bash
# UI and Styling
npm install @radix-ui/react-* class-variance-authority clsx tailwind-merge

# Form Handling and Validation
npm install react-hook-form @hookform/resolvers zod

# State Management (when needed)
npm install @tanstack/react-query zustand

# Development Tools
npm install -D @testing-library/react @testing-library/jest-dom vitest jsdom
```

## 🛡️ Data Validation with Zod (MANDATORY FOR ALL EXTERNAL DATA)

### MUST Follow These Validation Rules
- **MUST validate ALL external data**: API responses, form inputs, URL params, environment variables
- **MUST use branded types**: For all IDs and domain-specific values
- **MUST fail fast**: Validate at system boundaries, throw errors immediately
- **MUST use type inference**: Always derive TypeScript types from Zod schemas

### Schema Example (MANDATORY PATTERNS)
```typescript
import { z } from 'zod';

// MUST use branded types for ALL IDs
const UserIdSchema = z.string().uuid().brand<'UserId'>();
type UserId = z.infer<typeof UserIdSchema>;

// Environment validation (REQUIRED)
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);

// API response validation
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    error: z.string().optional(),
    timestamp: z.string().datetime(),
  });
```

### Form Validation with React Hook Form
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
});

type FormData = z.infer<typeof formSchema>;

function UserForm(): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    // Handle validated data
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## 🧪 Testing Strategy (MANDATORY REQUIREMENTS)

### MUST Meet These Testing Standards
- **MINIMUM 80% code coverage** - NO EXCEPTIONS
- **MUST co-locate tests** with components in `__tests__` folders
- **MUST use React Testing Library** for all component tests
- **MUST test user behavior** not implementation details
- **MUST mock external dependencies** appropriately

### Test Configuration (Vitest + React Testing Library)
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
```

### Test Example (WITH MANDATORY DOCUMENTATION)
```typescript
/**
 * @fileoverview Tests for UserProfile component
 * @module components/__tests__/UserProfile.test
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@testing-library/react';
import { UserProfile } from '../UserProfile';

/**
 * Test suite for UserProfile component.
 * 
 * Tests user interactions, state management, and error handling.
 * Mocks external dependencies to ensure isolated unit tests.
 */
describe('UserProfile', () => {
  /**
   * Tests that user name updates correctly on form submission.
   */
  it('should update user name on form submission', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    
    render(<UserProfile onUpdate={onUpdate} />);
    
    const input = screen.getByLabelText(/name/i);
    await user.type(input, 'John Doe');
    await user.click(screen.getByRole('button', { name: /save/i }));
    
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'John Doe' })
    );
  });
});
```

## 🎨 Component Guidelines (STRICT REQUIREMENTS)

### MANDATORY Component Documentation

```typescript
/**
 * Button component with multiple variants and sizes.
 * 
 * Provides a reusable button with consistent styling and behavior
 * across the application. Supports keyboard navigation and screen readers.
 * 
 * @component
 * @example
 * ```tsx
 * <Button 
 *   variant="primary" 
 *   size="medium" 
 *   onClick={handleSubmit}
 * >
 *   Submit Form
 * </Button>
 * ```
 */
interface ButtonProps {
  /** Visual style variant of the button */
  variant: 'primary' | 'secondary';
  
  /** Size of the button @default 'medium' */
  size?: 'small' | 'medium' | 'large';
  
  /** Click handler for the button */
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  
  /** Content to be rendered inside the button */
  children: React.ReactNode;
  
  /** Whether the button is disabled @default false */
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size = 'medium', onClick, children, disabled = false }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }))}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

### Shadcn/UI Component Pattern (RECOMMENDED)
```typescript
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

## 🔄 State Management (STRICT HIERARCHY)

### MUST Follow This State Hierarchy
1. **Local State**: `useState` ONLY for component-specific state
2. **Context**: For cross-component state within a single feature
3. **URL State**: MUST use search params for shareable state
4. **Server State**: MUST use TanStack Query for ALL API data
5. **Global State**: Zustand ONLY when truly needed app-wide

### Server State Pattern (TanStack Query)
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function useUser(id: UserId) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`);
      
      if (!response.ok) {
        throw new ApiError('Failed to fetch user', response.status);
      }
      
      const data = await response.json();
      return userSchema.parse(data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: UpdateUserData) => {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new ApiError('Failed to update user', response.status);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
```

## 🔐 Security Requirements (MANDATORY)

### Input Validation (MUST IMPLEMENT ALL)
- **MUST sanitize ALL user inputs** with Zod before processing
- **MUST validate file uploads**: type, size, and content
- **MUST prevent XSS** with proper escaping
- **MUST implement CSRF protection** for forms
- **NEVER use dangerouslySetInnerHTML** without sanitization

### Environment Variables (MUST VALIDATE)
```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

## 🚀 Performance Guidelines

### Next.js 15 Optimizations
- **Use Server Components** by default for data fetching
- **Client Components** only when necessary (interactivity)
- **Dynamic imports** for large client components
- **Image optimization** with next/image
- **Font optimization** with next/font

### Bundle Optimization
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      // Turbopack configuration
    },
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Bundle analyzer
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    return config;
  },
};

module.exports = nextConfig;
```

## 💅 Code Style & Quality

### ESLint Configuration (MANDATORY)
```javascript
// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "no-console": ["error", { "allow": ["warn", "error"] }],
      "react/function-component-definition": ["error", {
        "namedComponents": "arrow-function"
      }],
    },
  },
];

export default eslintConfig;
```

## 📋 Development Commands

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --max-warnings 0",
    "lint:fix": "next lint --fix",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "validate": "npm run type-check && npm run lint && npm run test:coverage"
  }
}
```

## ⚠️ CRITICAL GUIDELINES (MUST FOLLOW ALL)

1. **ENFORCE strict TypeScript** - ZERO compromises on type safety
2. **VALIDATE everything with Zod** - ALL external data must be validated
3. **MINIMUM 80% test coverage** - NO EXCEPTIONS
4. **MUST co-locate related files** - Tests MUST be in `__tests__` folders
5. **MAXIMUM 500 lines per file** - Split if larger
6. **MAXIMUM 200 lines per component** - Refactor if larger
7. **MUST handle ALL states** - Loading, error, empty, and success
8. **MUST use semantic commits** - feat:, fix:, docs:, refactor:, test:
9. **MUST write complete JSDoc** - ALL exports must be documented
10. **NEVER use `any` type** - Use proper typing or `unknown`
11. **MUST pass ALL automated checks** - Before ANY merge

## 📋 Pre-commit Checklist (MUST COMPLETE ALL)

- [ ] TypeScript compiles with ZERO errors (`npm run type-check`)
- [ ] Tests written and passing with 80%+ coverage (`npm run test:coverage`)
- [ ] ESLint passes with ZERO warnings (`npm run lint`)
- [ ] Prettier formatting applied (`npm run format`)
- [ ] All components have complete JSDoc documentation
- [ ] Zod schemas validate ALL external data
- [ ] ALL states handled (loading, error, empty, success)
- [ ] Error boundaries implemented for features
- [ ] Accessibility requirements met (ARIA labels, keyboard nav)
- [ ] No console.log statements in production code
- [ ] Environment variables validated with Zod
- [ ] Component files under 200 lines
- [ ] No prop drilling beyond 2 levels
- [ ] Server/Client components used appropriately

### FORBIDDEN Practices
- **NEVER use `any` type** (except library declaration merging with comments)
- **NEVER skip tests** for new functionality
- **NEVER ignore TypeScript errors** with `@ts-ignore`
- **NEVER trust external data** without Zod validation
- **NEVER use `JSX.Element`** - use `ReactElement` instead
- **NEVER store sensitive data** in localStorage or client state
- **NEVER use dangerouslySetInnerHTML** without sanitization
- **NEVER exceed file/component size limits**
- **NEVER prop drill** beyond 2 levels - use context or state management
- **NEVER commit** without passing all quality checks

---

