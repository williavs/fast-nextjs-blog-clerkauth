import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { pool } from './db'

export interface BlogPost {
  slug: string
  title: string
  date: string
  category: string
  tags: string[]
  excerpt: string
  content: string
  source: 'mdx' | 'database'
  id?: number // Only for database posts
  published?: boolean // Only for database posts
}

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    // Get MDX posts
    const mdxPosts = getMdxPosts()
    
    // Get database posts (only published ones for public)
    const dbPosts = await getDatabasePosts(true)
    
    // Combine and sort by date
    const allPosts = [...mdxPosts, ...dbPosts]
    return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch (error) {
    console.error('Error getting all posts:', error)
    return []
  }
}

export function getMdxPosts(): BlogPost[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    return fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
          slug,
          title: data.title || '',
          date: data.date || '',
          category: data.category || 'uncategorized',
          tags: data.tags || [],
          excerpt: data.excerpt || '',
          content,
          source: 'mdx'
        } as BlogPost
      })
  } catch (error) {
    console.error('Error reading MDX posts:', error)
    return []
  }
}

export async function getDatabasePosts(publishedOnly = false): Promise<BlogPost[]> {
  try {
    const query = publishedOnly 
      ? 'SELECT * FROM posts WHERE published = true ORDER BY created_at DESC'
      : 'SELECT * FROM posts ORDER BY created_at DESC'
    
    const result = await pool.query(query)
    
    return result.rows.map(post => ({
      slug: post.slug,
      title: post.title,
      date: post.created_at.split('T')[0], // Convert to YYYY-MM-DD format
      category: post.category || 'uncategorized',
      tags: post.tags || [],
      excerpt: post.excerpt || '',
      content: post.content,
      source: 'database' as const,
      id: post.id,
      published: post.published
    }))
  } catch (error) {
    console.error('Error reading database posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // First try MDX
    const mdxPath = path.join(postsDirectory, `${slug}.mdx`)
    if (fs.existsSync(mdxPath)) {
      const fileContents = fs.readFileSync(mdxPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || '',
        date: data.date || '',
        category: data.category || 'uncategorized',
        tags: data.tags || [],
        excerpt: data.excerpt || '',
        content,
        source: 'mdx'
      } as BlogPost
    }

    // Then try database
    const result = await pool.query('SELECT * FROM posts WHERE slug = $1 AND published = true', [slug])
    if (result.rows.length > 0) {
      const post = result.rows[0]
      return {
        slug: post.slug,
        title: post.title,
        date: post.created_at.split('T')[0],
        category: post.category || 'uncategorized',
        tags: post.tags || [],
        excerpt: post.excerpt || '',
        content: post.content,
        source: 'database',
        id: post.id,
        published: post.published
      }
    }

    return null
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts()
  const categories = posts.map(post => post.category)
  return Array.from(new Set(categories)).sort()
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tags = posts.flatMap(post => post.tags)
  return Array.from(new Set(tags)).sort()
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts.filter(post => post.category === category)
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts.filter(post => post.tags.includes(tag))
}