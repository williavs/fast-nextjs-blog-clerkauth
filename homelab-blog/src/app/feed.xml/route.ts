import { getAllPosts } from '@/lib/posts'
import RSS from 'rss'

export async function GET() {
  const posts = await getAllPosts()
  
  const feed = new RSS({
    title: 'Breaking Shit & Fixing It',
    description: 'Infrastructure as Code when you barely know how to code. Real failures, real solutions.',
    site_url: 'https://homelab-blog.vercel.app',
    feed_url: 'https://homelab-blog.vercel.app/feed.xml',
    language: 'en',
    managingEditor: 'WillyV3',
    webMaster: 'WillyV3',
    copyright: '2025 WillyV3',
    pubDate: new Date(),
    ttl: 60,
  })

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.excerpt,
      url: `https://homelab-blog.vercel.app/blog/${post.slug}`,
      date: new Date(post.date),
      categories: post.tags || [],
      author: 'WillyV3',
    })
  })

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}