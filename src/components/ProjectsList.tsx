'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/8bit/badge'
import { Button } from '@/components/ui/8bit/button'
import { ChevronDown } from 'lucide-react'
import type { Project } from '@/lib/types/project'

interface ProjectsListProps {
  projects: Project[]
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const [showAll, setShowAll] = useState(false)
  const INITIAL_DISPLAY = 20

  const displayedProjects = showAll ? projects : projects.slice(0, INITIAL_DISPLAY)
  const hasMore = projects.length > INITIAL_DISPLAY

  if (projects.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No projects found
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-8 font-virtue uppercase retro">All Projects</h2>
      <div className="space-y-4">
        {displayedProjects.map((project) => {
          const hasImage = project.manual_screenshot_url && project.manual_screenshot_url.startsWith('http');

          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="block border-4 border-border p-3 sm:p-4 hover:border-primary hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-1 active:translate-y-1"
              style={{ borderRadius: 0 }}
            >
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                {hasImage && (
                  <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 border-4 border-border overflow-hidden" style={{ imageRendering: 'pixelated' }}>
                    <Image
                      src={project.manual_screenshot_url!}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 128px"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                    <h3 className="font-virtue text-base sm:text-lg font-bold uppercase retro break-words">
                      {project.title}
                    </h3>
                    {project.category && (
                      <Badge variant="outline" className="text-xs uppercase font-bold border-2 flex-shrink-0">
                        {project.category}
                      </Badge>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-xs sm:text-sm mb-3 leading-relaxed break-words">
                      {project.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-xs font-bold uppercase">
                    {project.github_url && (
                      <span className="border-2 border-border px-2 py-1 hover:bg-primary hover:text-primary-foreground whitespace-nowrap">
                        GitHub ↗
                      </span>
                    )}
                    {project.homepage_url && project.homepage_url !== project.github_url && (
                      <span className="border-2 border-border px-2 py-1 hover:bg-accent hover:text-accent-foreground whitespace-nowrap">
                        Demo ↗
                      </span>
                    )}
                    {project.language && (
                      <span className="px-2 py-1 whitespace-nowrap">
                        {project.language}
                      </span>
                    )}
                    {project.stars !== null && project.stars !== undefined && (
                      <span className="px-2 py-1 whitespace-nowrap">
                        ★ {project.stars}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* See More Button */}
      {hasMore && !showAll && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => setShowAll(true)}
            size="lg"
            className="uppercase font-bold border-4 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
            style={{ borderRadius: 0 }}
          >
            <ChevronDown className="mr-2 h-5 w-5" />
            See More Projects ({projects.length - INITIAL_DISPLAY} more)
          </Button>
        </div>
      )}

      {/* Scroll to Top Button - shown when viewing all */}
      {showAll && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => {
              setShowAll(false)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            variant="outline"
            size="lg"
            className="uppercase font-bold border-4"
            style={{ borderRadius: 0 }}
          >
            Show Less
          </Button>
        </div>
      )}
    </div>
  )
}
