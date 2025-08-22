import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BlogPost } from '@/lib/posts'

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <Card className="hover:shadow-xl transition-all duration-200 h-full">
        <CardHeader>
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className="font-mono text-xs">
              {post.category}
            </Badge>
            <span className="text-muted-foreground text-sm font-mono">
              {new Date(post.date).toLocaleDateString()}
            </span>
          </div>
          <CardTitle className="text-xl font-bold mb-2 line-clamp-2 font-virtue">
            {post.title}
          </CardTitle>
          <CardDescription className="text-base line-clamp-3">
            {post.excerpt}
          </CardDescription>
        </CardHeader>
        {post.tags.length > 0 && (
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  )
}