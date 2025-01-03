'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { LoadingLogo } from '@/components/loading-logo'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isHydrated } = useAuthStore()

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login')
    }
  }, [isHydrated, isAuthenticated, router])

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingLogo />
      </div>
    )
  }

  return isAuthenticated ? children : null
}
