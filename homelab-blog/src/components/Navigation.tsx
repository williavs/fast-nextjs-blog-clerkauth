'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Rss, Settings } from 'lucide-react'
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'

export function Navigation() {
  const { user } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (user?.id) {
      fetch('/api/admin/check')
        .then(res => res.json())
        .then(data => setIsAdmin(data.isAdmin))
        .catch(() => setIsAdmin(false))
    }
  }, [user?.id])

  const getActiveTab = () => {
    if (pathname.startsWith('/blog')) return 'blog'
    if (pathname.startsWith('/stack')) return 'stack'
    if (pathname.startsWith('/admin') && isAdmin) return 'admin'
    return 'home'
  }

  const handleTabChange = (value: string) => {
    switch (value) {
      case 'home':
        router.push('/')
        break
      case 'blog':
        router.push('/blog')
        break
      case 'stack':
        router.push('/stack')
        break
      case 'admin':
        if (isAdmin) router.push('/admin')
        break
    }
  }
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex flex-col lg:flex-row lg:items-center lg:space-x-2 whitespace-nowrap font-virtue">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm sm:text-base">WillyV3</span>
              <Badge variant="secondary" className="text-xs">@Home</Badge>
              <span className="font-bold text-sm sm:text-base hidden sm:block">Breaking Shit & Fixing It</span>
            </div>
            <span className="text-muted-foreground text-xs hidden sm:block">Infrastructure as Code when you barely know how to code</span>
          </Link>
          
          <div className="flex items-center space-x-4 font-virtue">
            <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="w-auto">
              <TabsList className="relative bg-transparent border-0 p-0">
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-y-0 bg-background rounded-md shadow-sm border-0 m-1"
                  transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                  style={(() => {
                    // ===== NON-ADMIN CONFIG (3 tabs) =====
                    const nonAdminConfig = {
                      positions: {
                        home: '-1.3%',
                        blog: '33.333%', 
                        stack: '64.666%'
                      },
                      widths: {
                        home: '33.333%',
                        blog: '30.333%',
                        stack: '33.333%'
                      }
                    }
                    
                    // ===== ADMIN CONFIG (4 tabs) =====  
                    const adminConfig = {
                      positions: {
                        home: '-0.5%',
                        blog: '29%',
                        stack: '53.5%', 
                        admin: '82.5%'
                      },
                      widths: {
                        home: '26.333%',
                        blog: '23.333%',
                        stack: '27.333%',
                        admin: '15%'
                      }
                    }
                    
                    const config = isAdmin ? adminConfig : nonAdminConfig
                    const activeTab = getActiveTab() as keyof typeof config.positions
                    
                    return {
                      left: config.positions[activeTab] || '0%',
                      width: config.widths[activeTab] || '33.333%'
                    }
                  })()}
                />
                <TabsTrigger 
                  value="home" 
                  className="relative z-10 border-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all duration-300"
                  style={{ 
                    opacity: getActiveTab() === 'home' ? 1 : 0.6
                  }}
                >
                  Home
                </TabsTrigger>
                <TabsTrigger 
                  value="blog" 
                  className="relative z-10 border-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all duration-300"
                  style={{ 
                    opacity: getActiveTab() === 'blog' ? 1 : 0.6
                  }}
                >
                  Blog
                </TabsTrigger>
                <TabsTrigger 
                  value="stack" 
                  className="relative z-10 border-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all duration-300"
                  style={{ 
                    opacity: getActiveTab() === 'stack' ? 1 : 0.6
                  }}
                >
                  Stack
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger 
                    value="admin" 
                    className="relative z-10 border-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all duration-300"
                    style={{ 
                      opacity: getActiveTab() === 'admin' ? 1 : 0.6
                    }}
                  >
                    <Settings className="h-4 w-4" />
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>
            
            <a href="/feed.xml" className="flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              <Rss className="h-4 w-4" />
            </a>
            
            <SignedOut>
              <SignInButton>
                <div className="flex items-center justify-center h-9 px-4 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium cursor-pointer">
                  Sign In
                </div>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}