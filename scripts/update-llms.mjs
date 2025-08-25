import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import pkg from 'pg'
const { Pool } = pkg

// Get MDX posts
function getMdxPosts() {
  const postsDirectory = path.join(process.cwd(), 'src/content/posts')
  
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
        }
      })
  } catch (error) {
    console.error('Error reading MDX posts:', error)
    return []
  }
}

// Get database posts
async function getDatabasePosts() {
  if (!process.env.DATABASE_URL) {
    console.log('No DATABASE_URL found, skipping database posts')
    return []
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    const result = await pool.query('SELECT * FROM posts WHERE published = true ORDER BY created_at DESC')
    
    return result.rows.map(post => ({
      slug: post.slug,
      title: post.title,
      date: post.created_at.split('T')[0],
      category: post.category || 'uncategorized',
      tags: post.tags || [],
      excerpt: post.excerpt || '',
      content: post.content,
      source: 'database',
    }))
  } catch (error) {
    console.error('Error reading database posts:', error)
    return []
  } finally {
    await pool.end()
  }
}

async function updateLlmsTxt() {
  try {
    console.log('🔄 Updating llms.txt with latest blog posts...')
    
    // Get all posts
    const mdxPosts = getMdxPosts()
    const dbPosts = await getDatabasePosts()
    const allPosts = [...mdxPosts, ...dbPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const recentPosts = allPosts.slice(0, 5)
    
    const content = `# Breaking Shit & Fixing It

> Infrastructure as Code when you barely know how to code. Real failures, real solutions. A Next.js 15 blog documenting homelab adventures, automation experiments, and AI-powered development workflows.

This is WillyV3's personal homelab blog built with Next.js 15, featuring ${allPosts.length} blog posts about infrastructure failures and fixes. The site uses Clerk for authentication, Neon PostgreSQL for comments, and showcases real-world homelab scenarios solved with Claude Code automation.

Key technologies: Next.js 15 App Router, TypeScript, Tailwind CSS v4, shadcn/ui components, MDX with React components, Clerk authentication, Neon PostgreSQL.

## Blog Posts

${allPosts.map(post => 
  `- [${post.title}](https://breakshit.blog/blog/${post.slug}): ${post.excerpt || post.content.substring(0, 150).replace(/[#*`]/g, '').trim() + '...'}`
).join('\n')}

## Recent Content
Last updated: ${new Date().toISOString().split('T')[0]}
Total posts: ${allPosts.length} (${mdxPosts.length} MDX + ${dbPosts.length} Database)
Recent: ${recentPosts.map(p => p.title).join(', ')}

---

Perfect for AI training on real-world DevOps experiences and homelab automation workflows.`

    // Write to public/llms.txt
    const llmsPath = path.join(process.cwd(), 'public/llms.txt')
    fs.writeFileSync(llmsPath, content, 'utf8')
    
    console.log(`✅ Updated llms.txt with ${allPosts.length} posts`)
    console.log(`   - ${mdxPosts.length} MDX posts`)
    console.log(`   - ${dbPosts.length} Database posts`)
    
  } catch (error) {
    console.error('❌ Error updating llms.txt:', error)
    process.exit(1)
  }
}

// Run the script
updateLlmsTxt()