import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReposList } from '@/components/stack/ReposList'
import { fetchUserRepos, getCompleteRepoInfo } from '@/lib/webutils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Stack",
  description: "TUI applications and open source contributions by WillyV3",
  openGraph: {
    title: "Stack | BuiltByWilly",
    description: "TUI applications and open source contributions by WillyV3",
    url: "https://builtbywilly.com/stack",
    images: [
      {
        url: "/og-image-stack.png",
        width: 1200,
        height: 630,
        alt: "Stack - BuiltByWilly"
      }
    ]
  },
  twitter: {
    title: "Stack | BuiltByWilly",
    description: "TUI applications and open source contributions by WillyV3",
    images: ["/og-image-stack.png"]
  }
}

// Fetch TUI repos from WillyV3 (excluding homebrew-tap)
async function TUIReposContent() {
  const allRepoUrls = await fetchUserRepos('WillyV3')
  const tuiRepoUrls = allRepoUrls.filter(url => !url.includes('homebrew-tap'))

  // Fetch complete info for each repo
  const repoData = await Promise.all(
    tuiRepoUrls.map(url => getCompleteRepoInfo(url))
  )

  const validRepos = repoData.filter((r) => r !== null)
  return <ReposList repos={validRepos} />
}

// Fetch OpenSource repos from williavs
async function OpenSourceReposContent() {
  const repoUrls = await fetchUserRepos('williavs')

  // Fetch complete info for each repo
  const repoData = await Promise.all(
    repoUrls.map(url => getCompleteRepoInfo(url))
  )

  const validRepos = repoData.filter((r) => r !== null)
  return <ReposList repos={validRepos} />
}

// Loading fallback component
function ReposLoading() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="py-2 border-b border-border/50">
          <div className="flex items-start gap-2 mb-1">
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="h-3 w-16 bg-muted animate-pulse rounded" />
            <div className="h-3 w-12 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-3 w-full bg-muted animate-pulse rounded mt-1" />
        </div>
      ))}
    </div>
  )
}

export default function StackPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-virtue">
          Stack
        </h1>
        <p className="text-xl text-muted-foreground">
          TUI applications and open source contributions
        </p>
      </div>

      <Tabs defaultValue="tuis" className="w-full">
        {/* Tab Navigation */}
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="tuis" className="font-virtue">
            TUI&apos;s
          </TabsTrigger>
          <TabsTrigger value="opensource" className="font-virtue">
            OpenSource
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="tuis" className="space-y-6">
          <Suspense fallback={<ReposLoading />}>
            <TUIReposContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="opensource" className="space-y-6">
          <Suspense fallback={<ReposLoading />}>
            <OpenSourceReposContent />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}