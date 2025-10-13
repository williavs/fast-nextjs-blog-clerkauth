import { getProjectBySlug, getAllProjects } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Github, Download, Folder } from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | BuiltByWilly`,
    description: project.description || `${project.title} - A ${project.category} project`,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const screenshotUrl = project.manual_screenshot_url;
  const displayUrl = project.homepage_url || project.github_url;

  // Check if screenshot URL is valid and absolute
  const isValidUrl = (url: string | null): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const hasValidScreenshot = isValidUrl(screenshotUrl);

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Back Button */}
      <Link href="/projects">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 font-virtue">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-xl text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>

          <Badge variant="secondary" className="text-base px-4 py-1">
            {project.category}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
              <Button>
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
            </a>
          )}
          {project.homepage_url && (
            <a href={project.homepage_url} target="_blank" rel="noopener noreferrer">
              <Button variant={project.github_url ? "outline" : "default"}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Project
              </Button>
            </a>
          )}
          {project.install_command && (
            <Button variant="outline" className="font-mono text-sm">
              <Download className="w-4 h-4 mr-2" />
              {project.install_command}
            </Button>
          )}
        </div>
      </div>

      {/* Screenshot */}
      {hasValidScreenshot ? (
        <div className="mb-8 rounded-lg overflow-hidden border">
          <div className="relative aspect-video">
            <Image
              src={screenshotUrl!}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </div>
        </div>
      ) : (
        <Card className="mb-8">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Folder className="w-24 h-24 mb-4 opacity-20" />
              <p className="text-sm">No screenshot available</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tech Stack */}
      {project.tech_stack && project.tech_stack.length > 0 && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4 font-virtue">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech, index) => (
                <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Details */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4 font-virtue">Project Details</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">Category</dt>
              <dd className="text-base">{project.category}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">Source</dt>
              <dd className="text-base capitalize">{project.source}</dd>
            </div>
            {project.language && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">Language</dt>
                <dd className="text-base">{project.language}</dd>
              </div>
            )}
            {project.stars && project.stars > 0 && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">GitHub Stars</dt>
                <dd className="text-base">⭐ {project.stars}</dd>
              </div>
            )}
            {project.github_owner && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">GitHub Owner</dt>
                <dd className="text-base">{project.github_owner}</dd>
              </div>
            )}
            {project.github_repo && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">Repository</dt>
                <dd className="text-base">{project.github_repo}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* README Content */}
      {project.readme_content && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4 font-virtue">README</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{project.readme_content}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
