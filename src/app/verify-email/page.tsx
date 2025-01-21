"use client"

import { Suspense } from "react"
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiConfig, fetchApi } from '@/lib/api-config'
import { Loader2 } from 'lucide-react'

function VerifyEmailContent() {
  const [isVerifying, setIsVerifying] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const verifyEmail = async () => {
      try {
        await fetchApi(apiConfig.endpoints.auth.verify, {
          method: 'POST',
          body: JSON.stringify({ token }),
        })
        router.push('/verify-email/success')
    } catch (_error) {
        router.push('/verify-email/error')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyEmail()
  }, [token, router])

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Verifying your email...</p>
      </div>
    )
  }

  return null
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
      <VerifyEmailContent />
    </Suspense>
  )
}
