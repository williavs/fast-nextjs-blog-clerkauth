'use client';

/**
 * Project creation and editing form.
 *
 * Comprehensive form for manually adding portfolio projects with
 * screenshot upload, validation, and error handling.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useImageUpload } from '@/hooks/use-image-upload';
import { Button } from '@/components/ui/8bit/button';
import { Input } from '@/components/ui/8bit/input';
import { Textarea } from '@/components/ui/8bit/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/8bit/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Loader2 } from 'lucide-react';
import type { ProjectCategory } from '@/lib/types/project';

// Form schema
const projectFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['TUI', 'Web', 'CLI', 'Python', 'OSS'] as const),
  techStack: z.string().optional(),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  homepageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  installCommand: z.string().optional(),
  screenshot: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  project?: any; // For edit mode
  isEdit?: boolean;
}

export function ProjectForm({ project, isEdit = false }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image upload hook with auto-upload
  const screenshot = useImageUpload({ autoUpload: true });

  // Form setup
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      category: project?.category || 'CLI',
      techStack: project?.tech_stack?.join(', ') || '',
      githubUrl: project?.github_url || '',
      homepageUrl: project?.homepage_url || '',
      installCommand: project?.install_command || '',
      screenshot: project?.manual_screenshot_url || '',
    },
  });

  // Submit handler
  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Create slug from title
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Prepare project data
      const projectData = {
        slug,
        title: data.title,
        description: data.description,
        category: data.category,
        source: 'manual',
        tech_stack: data.techStack
          ? data.techStack.split(',').map(t => t.trim()).filter(Boolean)
          : null,
        github_url: data.githubUrl || null,
        homepage_url: data.homepageUrl || null,
        install_command: data.installCommand || null,
        manual_screenshot_url: screenshot.blobUrl || null,
        manual_images: screenshot.blobUrl ? [screenshot.blobUrl] : null,
      };

      // Submit to API
      const url = isEdit
        ? `/api/backstage/projects/${project.id}`
        : '/api/backstage/projects';

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save project');
      }

      // Success - redirect to projects list
      router.push('/backstage/projects');
      router.refresh();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save project';
      console.error('Project save error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Error message */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Project" {...field} />
              </FormControl>
              <FormDescription>
                The name of your project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief description of what your project does..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A clear description of your project (min 10 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="TUI">TUI (Terminal UI)</SelectItem>
                  <SelectItem value="Web">Web Application</SelectItem>
                  <SelectItem value="CLI">CLI Tool</SelectItem>
                  <SelectItem value="Python">Python Application</SelectItem>
                  <SelectItem value="OSS">OSS Contribution</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The primary type of your project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tech Stack */}
        <FormField
          control={form.control}
          name="techStack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tech Stack</FormLabel>
              <FormControl>
                <Input
                  placeholder="Go, Bubble Tea, Charm (comma-separated)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Technologies used, separated by commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GitHub URL */}
        <FormField
          control={form.control}
          name="githubUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://github.com/username/repo"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Link to the GitHub repository (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Homepage URL */}
        <FormField
          control={form.control}
          name="homepageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Homepage URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://myproject.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Project homepage or demo URL (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Install Command */}
        <FormField
          control={form.control}
          name="installCommand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Install Command</FormLabel>
              <FormControl>
                <Input
                  placeholder="npm install my-package"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Installation command for users (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Screenshot Upload */}
        <FormItem>
          <FormLabel>Screenshot</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {screenshot.previewUrl ? (
                <div className="relative inline-block">
                  <img
                    src={screenshot.previewUrl}
                    alt="Screenshot preview"
                    className="max-w-md rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={screenshot.handleRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {screenshot.uploading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  )}
                  {screenshot.blobUrl && (
                    <p className="text-xs text-muted-foreground mt-2">
                      ✓ Uploaded to Vercel Blob
                    </p>
                  )}
                </div>
              ) : (
                <div
                  onClick={screenshot.handleThumbnailClick}
                  className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload a screenshot
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
              <input
                ref={screenshot.fileInputRef}
                type="file"
                accept="image/*"
                onChange={screenshot.handleFileChange}
                className="hidden"
              />
            </div>
          </FormControl>
          <FormDescription>
            Upload a screenshot or preview image (optional)
          </FormDescription>
          {screenshot.uploadError && (
            <p className="text-sm text-destructive">{screenshot.uploadError}</p>
          )}
        </FormItem>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || screenshot.uploading}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Update Project' : 'Create Project'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/backstage/projects')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
