import { getProjectBySlug, getAllProjects } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/8bit/badge';
import { Button } from '@/components/ui/8bit/button';
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

  // Check if screenshot URL is valid and absolute
  const isValidUrl = (url: string | null | undefined): boolean => {
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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back Button */}
      <Link href="/">
        <Button variant="outline" className="mb-8 uppercase font-bold">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8 border-4 border-border p-6" style={{ borderRadius: 0 }}>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 font-virtue uppercase retro">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-base leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          <Badge variant="secondary" className="text-sm px-4 py-2 uppercase font-bold border-2">
            {project.category}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
              <Button className="uppercase font-bold">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </a>
          )}
          {project.homepage_url && (
            <a href={project.homepage_url} target="_blank" rel="noopener noreferrer">
              <Button variant={project.github_url ? "outline" : "default"} className="uppercase font-bold">
                <ExternalLink className="w-4 h-4 mr-2" />
                Demo
              </Button>
            </a>
          )}
          {project.install_command && (
            <Button variant="outline" className="font-mono text-xs uppercase">
              <Download className="w-4 h-4 mr-2" />
              {project.install_command}
            </Button>
          )}
        </div>
      </div>

      {/* Screenshot */}
      {hasValidScreenshot ? (
        <div className="mb-8 border-4 border-border overflow-hidden" style={{ borderRadius: 0 }}>
          <div className="relative aspect-video">
            <Image
              src={screenshotUrl!}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>
      ) : (
        <div className="mb-8 border-4 border-border p-16" style={{ borderRadius: 0 }}>
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Folder className="w-24 h-24 mb-4 opacity-20" />
            <p className="text-sm uppercase font-bold">No screenshot available</p>
          </div>
        </div>
      )}

      {/* Tech Stack */}
      {project.tech_stack && project.tech_stack.length > 0 && (
        <div className="mb-8 border-4 border-border p-6" style={{ borderRadius: 0 }}>
          <h2 className="text-xl font-bold mb-4 font-virtue uppercase retro">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech, index) => (
              <Badge key={index} variant="outline" className="text-sm px-3 py-1 uppercase font-bold border-2">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Project Details */}
      <div className="mb-8 border-4 border-border p-6" style={{ borderRadius: 0 }}>
        <h2 className="text-xl font-bold mb-6 font-virtue uppercase retro">Project Details</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-border p-3" style={{ borderRadius: 0 }}>
            <dt className="text-xs font-bold uppercase mb-2">Category</dt>
            <dd className="text-base font-bold">{project.category}</dd>
          </div>
          <div className="border-2 border-border p-3" style={{ borderRadius: 0 }}>
            <dt className="text-xs font-bold uppercase mb-2">Source</dt>
            <dd className="text-base font-bold capitalize">{project.source}</dd>
          </div>
          {project.language && (
            <div className="border-2 border-border p-3" style={{ borderRadius: 0 }}>
              <dt className="text-xs font-bold uppercase mb-2">Language</dt>
              <dd className="text-base font-bold">{project.language}</dd>
            </div>
          )}
          {project.stars && project.stars > 0 && (
            <div className="border-2 border-border p-3" style={{ borderRadius: 0 }}>
              <dt className="text-xs font-bold uppercase mb-2">GitHub Stars</dt>
              <dd className="text-base font-bold">⭐ {project.stars}</dd>
            </div>
          )}
          {project.github_owner && (
            <div className="border-2 border-border p-3" style={{ borderRadius: 0 }}>
              <dt className="text-xs font-bold uppercase mb-2">GitHub Owner</dt>
              <dd className="text-base font-bold">{project.github_owner}</dd>
            </div>
          )}
          {project.github_repo && (
            <div className="border-2 border-border p-3" style={{ borderRadius: 0 }}>
              <dt className="text-xs font-bold uppercase mb-2">Repository</dt>
              <dd className="text-base font-bold">{project.github_repo}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* README Content */}
      {project.readme_content && (
        <div className="border-4 border-border p-6" style={{ borderRadius: 0 }}>
          <h2 className="text-xl font-bold mb-4 font-virtue uppercase retro">README</h2>
          <div className="border-2 border-border p-4 bg-muted/30 font-mono text-xs overflow-x-auto" style={{ borderRadius: 0 }}>
            <pre className="whitespace-pre-wrap">{project.readme_content}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
