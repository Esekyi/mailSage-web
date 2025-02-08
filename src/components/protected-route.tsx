'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { LoadingLogo } from '@/components/loading-logo'
import dynamic from 'next/dynamic'

// Wrap the component in NoSSR to prevent hydration mismatch
const ProtectedRouteContent = ({ children }: { children: React.ReactNode }) => {
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

// Export a no-SSR version of the component
export const ProtectedRoute = dynamic(() => Promise.resolve(ProtectedRouteContent), {
  ssr: false,
}) as typeof ProtectedRouteContent
