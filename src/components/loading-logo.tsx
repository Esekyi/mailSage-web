"use client"

import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

const Image = dynamic(() => import('next/image'), { ssr: false })

export function LoadingLogo({ className }: { className?: string }) {
  const { theme } = useTheme()

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="relative animate-pulse">
        <Image
          src={theme === 'dark' ? '/navbarLogo-light.svg' : '/navbarLogo-dark.svg'}
          alt="mailSage Logo"
          width={32}
          height={32}
          priority
        />
      </div>
      <span className="font-semibold gradient-text animate-pulse">mailSage</span>
    </div>
  )
}
