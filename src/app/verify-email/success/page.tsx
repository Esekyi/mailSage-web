import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function VerificationSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold">Email Verified Successfully</h1>
        <p className="mt-2 text-lg text-muted-foreground">Your email has been verified. You can now use all features of your account.</p>
        <Button asChild className="mt-6">
          <Link href="/login">Return to Login</Link>
        </Button>
      </div>
    </div>
  )
}

