import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-center">
        <SignIn />
      </div>
    </div>
  )
}