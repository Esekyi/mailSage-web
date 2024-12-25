"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function VerificationErrorPage() {
  const router = useRouter()



  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-4 text-3xl font-bold">Verification Failed</h1>
        <p className="mt-2 text-lg text-muted-foreground">We couldn&apos;t verify your email. The link may have expired or is invalid.</p>
        <div className="mt-6 space-y-4">
          <Button onClick={() => router.push('/resend-verification')}>
            Resend Verification Email
          </Button>
          <div>
            <Link href="/login" className="text-sm text-primary hover:underline">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

