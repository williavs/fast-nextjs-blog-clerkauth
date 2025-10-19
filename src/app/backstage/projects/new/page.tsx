import { ProjectForm } from '@/components/backstage/ProjectForm';

export default async function NewProjectPage() {
  // Protected by Clerk middleware - any authenticated user can access

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2 font-virtue">
          New Project
        </h1>
        <p className="text-muted-foreground">
          Manually add a portfolio project with screenshots and details
        </p>
      </div>

      <ProjectForm />
    </div>
  );
}
