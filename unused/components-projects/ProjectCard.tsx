'use client';

/**
 * Project card component for grid display.
 *
 * Displays project preview with screenshot, title, description, and metadata.
 * Gracefully handles projects with or without screenshots.
 */

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Github, Folder } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
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
    <Card className="group overflow-hidden hover:shadow-lg transition-all">
      <Link href={`/projects/${project.slug}`}>
        {/* Screenshot or Placeholder */}
        <div className="aspect-video bg-muted relative overflow-hidden">
          {hasValidScreenshot ? (
            <Image
              src={screenshotUrl!}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <Folder className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}

          {/* Category Badge Overlay */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
              {project.category}
            </Badge>
          </div>
        </div>
      </Link>

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Link href={`/projects/${project.slug}`} className="flex-1">
            <CardTitle className="text-xl font-virtue group-hover:text-primary transition-colors">
              {project.title}
            </CardTitle>
          </Link>

          {/* External Links */}
          <div className="flex gap-1">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {displayUrl && !project.github_url && (
              <a
                href={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <CardDescription className="line-clamp-2">
          {project.description || 'No description available'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack.slice(0, 4).map((tech, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.tech_stack.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{project.tech_stack.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Stars (if available) */}
        {project.stars && project.stars > 0 && (
          <div className="text-xs text-muted-foreground mt-3">
            ⭐ {project.stars} stars
          </div>
        )}
      </CardContent>
    </Card>
  );
}
