import { SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { MessageSquare, User } from 'lucide-react'

export function SignInPrompt() {
  return (
    <div className="border border-dashed border-muted-foreground/25 rounded-lg p-6 text-center space-y-4">
      <div className="flex justify-center">
        <div className="rounded-full bg-muted p-3">
          <MessageSquare className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Join the conversation</h3>
        <p className="text-muted-foreground text-sm">
          Sign in to share your thoughts and engage with the community
        </p>
      </div>
      
      <SignInButton>
        <Button className="w-full sm:w-auto">
          <User className="h-4 w-4 mr-2" />
          Sign In to Comment
        </Button>
      </SignInButton>
    </div>
  )
}