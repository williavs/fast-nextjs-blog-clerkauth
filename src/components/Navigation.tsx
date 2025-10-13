'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/8bit/button'
import { Rss, Settings } from 'lucide-react'
import { SignedIn, UserButton, useUser } from '@clerk/nextjs'

export function Navigation() {
  const { user } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (user?.id) {
      fetch('/api/backstage/check')
        .then(res => res.json())
        .then(data => setIsAdmin(data.isAdmin))
        .catch(() => setIsAdmin(false))
    }
  }, [user?.id])

  const isHome = pathname === '/'
  const isBackstage = pathname.startsWith('/backstage')

  return (
    <nav>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-end gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={isHome ? "default" : "outline"}
              size="sm"
              onClick={() => router.push('/')}
            >
              Home
            </Button>

            {isAdmin && (
              <Button
                variant={isBackstage ? "default" : "outline"}
                size="sm"
                onClick={() => router.push('/backstage')}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href="/feed.xml">
                <Rss className="h-4 w-4" />
              </a>
            </Button>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}
