# WillyV3's Homelab Blog

> Infrastructure as Code when you barely know how to code. Real failures, real solutions.

A Next.js 15 blog with MDX support, Clerk authentication, Neon PostgreSQL comments, and doom-64 retro gaming theme.

## Features

- 🎮 **doom-64 theme** - Retro gaming aesthetic with shadcn/ui components
- 📝 **MDX blog posts** - Write rich content with React components
- 💬 **Comments system** - Authenticated comments with likes via Clerk + Neon
- 🔍 **SEO optimized** - Comprehensive metadata, sitemap, RSS feed
- 🚀 **Production ready** - Built with Next.js 15, TypeScript, Tailwind v4

## Adding Blog Posts with Claude Code

This blog is designed to work seamlessly with Claude Code. To add new blog posts:

### Method 1: Direct Command
```bash
claude "Add a new blog post about [topic]"
```

### Method 2: Detailed Instructions
```bash
claude "Create a new blog post:
- Title: Your Post Title
- Topic: Brief description
- Include code examples, images, or specific sections
- Add appropriate tags and metadata"
```

### Blog Post Structure
Claude Code will automatically:
- Create a new `.mdx` file in `/src/content/blog/`
- Generate proper frontmatter with title, date, excerpt, tags
- Structure content with headings, code blocks, and components
- Optimize for SEO with proper metadata

### Example Blog Post Request
```bash
claude "Write a blog post about setting up a Kubernetes cluster on Raspberry Pi. Include:
- Hardware requirements
- Installation steps with code
- Common troubleshooting issues
- Performance benchmarks
Tag it with: kubernetes, raspberry-pi, homelab"
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Neon PostgreSQL
DATABASE_URL=postgresql://...
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 + shadcn/ui (doom-64 theme)
- **Content**: MDX with gray-matter frontmatter
- **Auth**: Clerk
- **Database**: Neon PostgreSQL
- **Deployment**: Vercel-ready

## Repository

https://github.com/williavs/homelab-blog

---

Built with Claude Code 🤖
