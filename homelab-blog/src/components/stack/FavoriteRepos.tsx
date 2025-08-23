'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ExternalLink, Star, GitFork } from 'lucide-react'
import { useState } from 'react'
import { MarkdownRenderer } from './MarkdownRenderer'
import type { RepoInfo } from '@/lib/webutils'

interface FavoriteReposProps {
  repos: RepoInfo[]
}

export function FavoriteRepos({ repos }: FavoriteReposProps) {
  const [expandedRepos, setExpandedRepos] = useState<Set<string>>(new Set())

  const toggleExpanded = (fullName: string) => {
    const newExpanded = new Set(expandedRepos)
    if (newExpanded.has(fullName)) {
      newExpanded.delete(fullName)
    } else {
      newExpanded.add(fullName)
    }
    setExpandedRepos(newExpanded)
  }

  return (
    <div className="space-y-3">
      {repos.map((repo) => (
        <div key={repo.fullName} className="py-2 border-b border-border/50 last:border-0">
          {/* Title line with stats */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-baseline gap-2 flex-1">
              <h3 className="font-virtue text-sm font-medium hover:underline">
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  {repo.fullName}
                </a>
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {repo.stars !== undefined && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>{repo.stars.toLocaleString()}</span>
                  </div>
                )}
                {repo.forks !== undefined && (
                  <div className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    <span>{repo.forks.toLocaleString()}</span>
                  </div>
                )}
                {repo.language && (
                  <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                    {repo.language}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0 opacity-50 hover:opacity-100" asChild>
              <a href={repo.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>

          {/* Description and README toggle */}
          <div className="flex items-start justify-between gap-2 mb-1">
            {repo.description && (
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                {repo.description}
              </p>
            )}
            
            {repo.readme && (
              <Collapsible 
                open={expandedRepos.has(repo.fullName)}
                onOpenChange={() => toggleExpanded(repo.fullName)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-5 px-2 text-xs opacity-75 hover:opacity-100">
                    <ChevronDown 
                      className={`h-3 w-3 mr-1 transition-transform ${
                        expandedRepos.has(repo.fullName) ? 'rotate-180' : ''
                      }`} 
                    />
                    README
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            )}
          </div>

          {/* README Content */}
          {repo.readme && (
            <Collapsible 
              open={expandedRepos.has(repo.fullName)}
              onOpenChange={() => toggleExpanded(repo.fullName)}
            >
              <CollapsibleContent>
                <div className="mt-2 p-4 bg-muted/30 rounded-md max-h-96 overflow-y-auto border">
                  <MarkdownRenderer content={repo.readme} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      ))}
    </div>
  )
}