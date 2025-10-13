import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllProjects } from '@/lib/db'
import { Badge } from '@/components/ui/8bit/badge'
import { ProgressiveDialogue } from '@/components/ProgressiveDialogue'

// Async component for all projects
async function AllProjects() {
  const allProjects = await getAllProjects()

  if (allProjects.length === 0) {
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
        {allProjects.map((project) => {
          const hasImage = project.manual_screenshot_url && project.manual_screenshot_url.startsWith('http');

          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="block border-4 border-border p-4 hover:border-primary hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-1 active:translate-y-1"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-start gap-4">
                {hasImage && (
                  <div className="relative w-32 h-32 flex-shrink-0 border-4 border-border overflow-hidden" style={{ imageRendering: 'pixelated' }}>
                    <Image
                      src={project.manual_screenshot_url!}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="128px"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-virtue text-lg font-bold uppercase retro">
                      {project.title}
                    </h3>
                    {project.category && (
                      <Badge variant="outline" className="text-xs uppercase font-bold border-2">
                        {project.category}
                      </Badge>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-sm mb-3 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                  <div className="flex gap-4 text-xs font-bold uppercase">
                    {project.github_url && (
                      <span className="border-2 border-border px-2 py-1 hover:bg-primary hover:text-primary-foreground">
                        GitHub ↗
                      </span>
                    )}
                    {project.homepage_url && project.homepage_url !== project.github_url && (
                      <span className="border-2 border-border px-2 py-1 hover:bg-accent hover:text-accent-foreground">
                        Demo ↗
                      </span>
                    )}
                    {project.language && (
                      <span className="px-2 py-1">
                        {project.language}
                      </span>
                    )}
                    {project.stars !== null && project.stars !== undefined && (
                      <span className="px-2 py-1">
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
    </div>
  )
}

// Loading component for projects list
function ProjectsLoading() {
  return (
    <div>
      <div className="h-10 w-64 bg-muted animate-pulse mb-8 border-4 border-border" style={{ borderRadius: 0 }} />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-4 border-border p-4" style={{ borderRadius: 0 }}>
            <div className="flex gap-4">
              <div className="w-32 h-32 bg-muted animate-pulse border-4 border-border flex-shrink-0" />
              <div className="flex-1">
                <div className="h-6 w-48 bg-muted animate-pulse border-2 border-border mb-3" style={{ borderRadius: 0 }} />
                <div className="h-4 w-full bg-muted animate-pulse border-2 border-border mb-2" style={{ borderRadius: 0 }} />
                <div className="h-4 w-3/4 bg-muted animate-pulse border-2 border-border mb-3" style={{ borderRadius: 0 }} />
                <div className="flex gap-4">
                  <div className="h-6 w-20 bg-muted animate-pulse border-2 border-border" style={{ borderRadius: 0 }} />
                  <div className="h-6 w-16 bg-muted animate-pulse border-2 border-border" style={{ borderRadius: 0 }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <ProgressiveDialogue />

        <Suspense fallback={<ProjectsLoading />}>
          <AllProjects />
        </Suspense>
      </div>
    </div>
  )
}
