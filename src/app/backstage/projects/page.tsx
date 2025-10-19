import { getAllProjects } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/8bit/button';
import { ProjectsTable } from '@/components/backstage/ProjectsTable';
import { PlusCircle } from 'lucide-react';

export default async function ProjectsListPage() {
  // Protected by Clerk middleware - any authenticated user can access

  // Fetch all projects
  const projects = await getAllProjects();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 font-virtue">
            Projects
          </h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects ({projects.length} total)
          </p>
        </div>

        <Link href="/backstage/projects/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  );
}
