import { getAllProjects } from '@/lib/db';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';

export const metadata = {
  title: 'Projects | BuiltByWilly',
  description: 'Portfolio of projects built by WillyV3 - TUI apps, web applications, CLI tools, Python projects, and open source contributions.',
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-5xl font-bold tracking-tight mb-4 font-virtue">
          Projects
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A collection of TUI applications, web apps, CLI tools, and open source contributions.
          Built with Go, Python, TypeScript, and whatever gets the job done.
        </p>
      </div>

      <ProjectsGrid projects={projects} />
    </div>
  );
}
