'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/8bit/button'
import { Rss, Settings, Menu } from 'lucide-react'
import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/8bit/dropdown-menu'

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
        <div className="flex h-16 items-center justify-between gap-1">
          {/* Left side - Main nav buttons */}
          <div className="flex items-center gap-0">
            <Button
              variant={isHome ? "default" : "outline"}
              size="sm"
              onClick={() => router.push('/')}
              className="uppercase font-bold rounded-none border-r-0"
            >
              Home
            </Button>

            {/* Mobile dropdown menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-none"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 text-xs">
                  <DropdownMenuItem asChild>
                    <a href="https://breakshit.blog" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                      Blog
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/stack')}>
                    Stack
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="https://github.com/williavs" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                      GitHub
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://www.linkedin.com/in/willyv3/" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                      LinkedIn
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://willyv3.com" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                      Home
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://willyv3.com/app-playground" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                      Apps
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop nav buttons */}
            <div className="hidden md:flex items-center">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-none border-r-0"
              >
                <a href="https://breakshit.blog" target="_blank" rel="noopener noreferrer" className="uppercase font-bold">
                  Blog
                </a>
              </Button>

              <Button
                variant={isStack ? "default" : "outline"}
                size="sm"
                onClick={() => router.push('/stack')}
                className="uppercase font-bold rounded-none"
              >
                Stack
              </Button>
            </div>
          </div>

          {/* Right side - Social & utility buttons */}
          <div className="flex items-center gap-0">
            {/* Desktop social buttons */}
            <div className="hidden lg:flex items-center">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="uppercase font-bold rounded-none border-r-0"
              >
                <a href="https://github.com/williavs" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </Button>

              <Button
                variant="outline"
                size="sm"
                asChild
                className="uppercase font-bold rounded-none border-r-0"
              >
                <a href="https://www.linkedin.com/in/willyv3/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </Button>

              <Button
                variant="outline"
                size="sm"
                asChild
                className="uppercase font-bold rounded-none border-r-0"
              >
                <a href="https://willyv3.com" target="_blank" rel="noopener noreferrer">
                  Home
                </a>
              </Button>

              <Button
                variant="outline"
                size="sm"
                asChild
                className="uppercase font-bold rounded-none border-r-0"
              >
                <a href="https://willyv3.com/app-playground" target="_blank" rel="noopener noreferrer">
                  Apps
                </a>
              </Button>
            </div>

            {isAdmin && (
              <Button
                variant={isBackstage ? "default" : "outline"}
                size="sm"
                onClick={() => router.push('/backstage')}
                className="rounded-none border-r-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-none border-r-0"
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
