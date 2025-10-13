'use client';

/**
 * Projects grid with filtering.
 *
 * Displays projects in a responsive grid with category filtering.
 * Handles projects with and without screenshots gracefully.
 */

import { useState } from 'react';
import type { Project } from '@/lib/db';
import { ProjectCard } from './ProjectCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter projects
  const filteredProjects = projects.filter(project => {
    if (categoryFilter === 'all') return true;
    return project.category === categoryFilter;
  });

  // Get unique categories
  const categories = Array.from(new Set(projects.map(p => p.category)));

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-sm text-muted-foreground">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No projects found in this category
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
