import { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BlogPost } from '@/lib/posts'

interface BlogLayoutProps {
  children: ReactNode
  post: BlogPost
}

export function BlogLayout({ children, post }: BlogLayoutProps) {
  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <Badge variant="secondary" className="font-mono">
            {post.category}
          </Badge>
          <time className="text-muted-foreground font-mono text-sm">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {post.title}
        </h1>
        
        {post.excerpt && (
          <p className="text-lg sm:text-xl text-muted-foreground mb-6">
            {post.excerpt}
          </p>
        )}
        
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <Separator className="my-8" />
      </header>
      
      <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
        {children}
      </div>
    </article>
  )
}