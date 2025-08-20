import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export function Navigation() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl font-mono">
              WillyV3
            </span>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              @Home
            </Badge>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/blog">
              <Button variant="ghost" className="font-mono">
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