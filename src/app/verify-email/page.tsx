"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchApi } from '@/lib/api-config'
import { Loader2 } from 'lucide-react'

export default function VerifyEmail() {
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
        await fetchApi('/api/v1/auth/verify-email', {
          method: 'POST',
          body: JSON.stringify({ token }),
        })
        router.push('/verify-email/success')
      } catch (error) {
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