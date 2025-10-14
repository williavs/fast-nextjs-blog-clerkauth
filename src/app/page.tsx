import { Suspense } from 'react'
import { getAllProjects } from '@/lib/db'
import { ProgressiveDialogue } from '@/components/ProgressiveDialogue'
import { ProjectsList } from '@/components/ProjectsList'

// Server component for data fetching
async function ProjectsDataLoader() {
  const allProjects = await getAllProjects()
  return <ProjectsList projects={allProjects} />
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
          <ProjectsDataLoader />
        </Suspense>
      </div>
    </div>
  )
}
