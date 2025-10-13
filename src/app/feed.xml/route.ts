import { getAllProjects } from '@/lib/db'
import RSS from 'rss'

export async function GET() {
  const projects = await getAllProjects()

  const feed = new RSS({
    title: 'BuiltByWilly - Projects',
    description: 'Portfolio of TUI applications, web projects, CLI tools, and open source contributions by WillyV3',
    site_url: 'https://builtbywilly.com',
    feed_url: 'https://builtbywilly.com/feed.xml',
    language: 'en',
    managingEditor: 'WillyV3',
    webMaster: 'WillyV3',
    copyright: '2025 WillyV3',
    pubDate: new Date(),
    ttl: 60,
  })

  projects.forEach((project) => {
    feed.item({
      title: project.title,
      description: project.description || `${project.category} project`,
      url: `https://builtbywilly.com/projects/${project.slug}`,
      date: project.created_at || new Date(),
      categories: [project.category],
      author: 'WillyV3',
    })
  })

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}