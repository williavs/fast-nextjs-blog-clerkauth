import { redirect } from 'next/navigation'

// Blog functionality has been removed - redirect to backstage dashboard
export default function PostsListPage() {
  redirect('/backstage')
}
