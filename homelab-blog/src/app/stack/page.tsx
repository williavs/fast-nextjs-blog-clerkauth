import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FavoriteRepos } from '@/components/stack/FavoriteRepos'
import { HomelabStack } from '@/components/stack/HomelabStack'
import { OtherShit } from '@/components/stack/OtherShit'
import { getCompleteRepoInfo } from '@/lib/webutils'
import stackContent from '@/lib/stack-content.json'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Stack",
  description: "Tools, repos, and infrastructure that power WillyV3's homelab and development workflow.",
  openGraph: {
    title: "Stack | Breaking Shit & Fixing It",
    description: "Tools, repos, and infrastructure that power WillyV3's homelab and development workflow.",
    url: "https://breakshit.blog/stack",
    images: [
      {
        url: "/og-image-stack.png",
        width: 1200,
        height: 630,
        alt: "Stack - Breaking Shit & Fixing It"
      }
    ]
  },
  twitter: {
    title: "Stack | Breaking Shit & Fixing It",
    description: "Tools, repos, and infrastructure that power WillyV3's homelab and development workflow.",
    images: ["/og-image-stack.png"]
  }
}

// Async component for GitHub repos that can be suspended
async function ReposContent() {
  const repoData = await Promise.all(
    stackContent.favoriteRepos.map(async (url) => {
      const repoInfo = await getCompleteRepoInfo(url)
      return repoInfo
    })
  )

  const validRepos = repoData.filter((repo) => repo !== null)
  return <FavoriteRepos repos={validRepos} />
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
          Tools, repos, and infrastructure that actually work
        </p>
      </div>

      <Tabs defaultValue="repos" className="w-full">
        {/* Tab Navigation */}
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="repos" className="font-virtue">
            Favorite Repos
          </TabsTrigger>
          <TabsTrigger value="homelab" className="font-virtue">
            Homelab Stack
          </TabsTrigger>
          <TabsTrigger value="other" className="font-virtue">
            Other Shit I Use
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="repos" className="space-y-6">
          <Suspense fallback={<ReposLoading />}>
            <ReposContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="homelab" className="space-y-6">
          <HomelabStack />
        </TabsContent>

        <TabsContent value="other" className="space-y-6">
          <OtherShit />
        </TabsContent>
      </Tabs>
    </div>
  )
}