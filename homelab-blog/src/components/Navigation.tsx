import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export function Navigation() {
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
            <Link href="/blog">
              <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                Blog
              </Button>
            </Link>
            
            <SignedOut>
              <SignInButton>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
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