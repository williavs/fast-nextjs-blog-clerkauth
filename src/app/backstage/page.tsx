import { getAllProjects } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/8bit/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/8bit/card';
import { PlusCircle, FolderKanban, Sparkles } from 'lucide-react';

export default async function BackstageDashboard() {
  // Protected by Clerk middleware - any authenticated user can access

  // Fetch projects for stats
  const projects = await getAllProjects();
  const githubProjects = projects.filter(p => p.source === 'github');
  const manualProjects = projects.filter(p => p.source === 'manual');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-virtue uppercase retro">
          Backstage
        </h1>
        <p className="text-xl">
          Manage your portfolio projects
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {githubProjects.length} from GitHub, {manualProjects.length} manual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(projects.map(p => p.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              TUI, Web, CLI, Python, OSS
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {githubProjects.length > 0 ? 'Today' : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              GitHub project sync
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <PlusCircle className="h-5 w-5" />
              <CardTitle className="font-virtue uppercase">New Project</CardTitle>
            </div>
            <CardDescription>
              Manually add a portfolio project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/backstage/projects/new">
              <Button className="w-full uppercase font-bold">
                Create Project
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FolderKanban className="h-5 w-5" />
              <CardTitle className="font-virtue uppercase">Manage Projects</CardTitle>
            </div>
            <CardDescription>
              View and edit portfolio projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/backstage/projects">
              <Button variant="outline" className="w-full uppercase font-bold">
                View Projects
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <CardTitle className="font-virtue uppercase">Sync GitHub</CardTitle>
            </div>
            <CardDescription>
              Re-sync projects from GitHub accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full uppercase font-bold" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}