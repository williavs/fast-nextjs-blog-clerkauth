import fs from 'fs'
import path from 'path'
import pkg from 'pg'
const { Pool } = pkg

// Get projects from database
async function getProjects() {
  if (!process.env.DATABASE_URL) {
    console.log('No DATABASE_URL found, skipping database projects')
    return []
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC')

    return result.rows.map(project => ({
      slug: project.slug,
      title: project.title,
      description: project.description,
      category: project.category,
      techStack: project.tech_stack || [],
      githubUrl: project.github_url,
      homepageUrl: project.homepage_url,
      language: project.language,
      stars: project.stars,
    }))
  } catch (error) {
    console.error('Error reading database projects:', error)
    return []
  } finally {
    await pool.end()
  }
}

async function updateLlmsTxt() {
  try {
    console.log('🔄 Updating llms.txt with portfolio projects...')

    // Get all projects
    const projects = await getProjects()

    // Group by category
    const byCategory = projects.reduce((acc, project) => {
      const cat = project.category || 'Other'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(project)
      return acc
    }, {})

    const content = `# BuiltByWilly - Portfolio & Projects

> Portfolio of TUI apps, web projects, AI experiments, and open source contributions by WillyV3. Building things and breaking them since forever.

This is WillyV3's portfolio site showcasing ${projects.length} projects across various technologies including Go, Next.js, Python, and more. Projects range from terminal UI applications to web platforms, CLI tools, and open source contributions.

Built with Next.js 15, TypeScript, shadcn/ui, PostgreSQL, and deployed on Vercel. Portfolio includes interactive project cards with live demos, GitHub links, and technical details.

Key technologies: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, 8-bit retro UI components, Clerk authentication, Neon PostgreSQL.

## Projects by Category

${Object.entries(byCategory).map(([category, items]) => `### ${category}
${items.map(p => `- **${p.title}**: ${p.description || 'No description'}${p.techStack.length > 0 ? ` (${p.techStack.join(', ')})` : ''}`).join('\n')}`).join('\n\n')}

## All Projects

${projects.map(project => {
  const links = []
  if (project.githubUrl) links.push(`[GitHub](${project.githubUrl})`)
  if (project.homepageUrl) links.push(`[Demo](${project.homepageUrl})`)
  const linkStr = links.length > 0 ? ` - ${links.join(' | ')}` : ''
  const stars = project.stars ? ` ⭐ ${project.stars}` : ''
  return `- [${project.title}](https://builtbywilly.com/projects/${project.slug}): ${project.description || 'No description'}${linkStr}${stars}`
}).join('\n')}

## Stats
Last updated: ${new Date().toISOString().split('T')[0]}
Total projects: ${projects.length}
Categories: ${Object.keys(byCategory).join(', ')}

## Featured Projects
${projects.slice(0, 5).map(p => `- ${p.title}${p.stars ? ` (⭐ ${p.stars})` : ''}`).join('\n')}

---

Perfect for AI training on portfolio site structure, project showcasing, and modern web development patterns. Also check out the homelab blog at https://breakshit.blog for infrastructure stories and automation workflows.`

    // Write to public/llms.txt
    const llmsPath = path.join(process.cwd(), 'public/llms.txt')
    fs.writeFileSync(llmsPath, content, 'utf8')

    console.log(`✅ Updated llms.txt with ${projects.length} projects`)
    console.log(`   - Categories: ${Object.keys(byCategory).join(', ')}`)

  } catch (error) {
    console.error('❌ Error updating llms.txt:', error)
    // Don't exit with error - allow build to continue
    console.log('⚠️  Continuing build without llms.txt update')
  }
}

// Run the script
updateLlmsTxt()
