'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/8bit/button'
import { Rss, Settings, Github, Linkedin, Globe, Layers } from 'lucide-react'
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
  const isStack = pathname === '/stack'
  const isBackstage = pathname.startsWith('/backstage')

  return (
    <nav>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left side - Main nav buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={isHome ? "default" : "outline"}
              size="sm"
              onClick={() => router.push('/')}
              className="uppercase font-bold"
            >
              Home
            </Button>

            {/* Desktop nav buttons - hidden on mobile */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href="https://breakshit.blog" target="_blank" rel="noopener noreferrer" className="uppercase font-bold">
                  Blog
                </a>
              </Button>

              <Button
                variant={isStack ? "default" : "outline"}
                size="sm"
                onClick={() => router.push('/stack')}
                className="uppercase font-bold"
              >
                <Layers className="h-4 w-4 mr-1" />
                Stack
              </Button>
            </div>

            {/* Tablet nav buttons - show 3 on medium screens */}
            <div className="hidden sm:flex md:hidden items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href="https://github.com/williavs" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href="https://www.linkedin.com/in/willyv3/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href="https://willyv3.com" target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Right side - Social & utility buttons */}
          <div className="flex items-center gap-2">
            {/* Desktop social icons */}
            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href="https://github.com/williavs" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href="https://www.linkedin.com/in/willyv3/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href="https://willyv3.com" target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href="https://willyv3.com/app-playground" target="_blank" rel="noopener noreferrer" className="uppercase font-bold">
                  Apps
                </a>
              </Button>
            </div>

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
