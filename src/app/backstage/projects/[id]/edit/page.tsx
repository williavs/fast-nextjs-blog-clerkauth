import { getProjectById } from '@/lib/db';
import { ProjectForm } from '@/components/backstage/ProjectForm';
import { notFound } from 'next/navigation';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  // Protected by Clerk middleware - any authenticated user can access

  const { id } = await params;

  // Fetch project
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2 font-virtue">
          Edit Project
        </h1>
        <p className="text-muted-foreground">
          Update project details and screenshots
        </p>
      </div>

      <ProjectForm project={project} isEdit />
    </div>
  );
}
