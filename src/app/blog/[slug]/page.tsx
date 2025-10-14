import { redirect } from 'next/navigation'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

// Blog functionality has been removed - redirect to home
export default async function BlogPostPage() {
  redirect('/')
}
