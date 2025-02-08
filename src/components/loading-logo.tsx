"use client"

import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'

const Image = dynamic(() => import('next/image'), {
  ssr: false,
  loading: () => <div className="w-8 h-8" />
})

interface LoadingLogoProps {
  className?: string
}

export const LoadingLogo = dynamic(() => Promise.resolve(({ className }: LoadingLogoProps) => {
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme || theme

  return (
    <div className="relative w-8 h-8">
      {currentTheme && (
        <Image
          src={currentTheme === 'dark' ? '/navbarLogo-light.svg' : '/navbarLogo-dark.svg'}
          alt="MailSage Logo"
          width={32}
          height={32}
          className={className}
          priority
        />
      )}
    </div>
  )
}), { ssr: false })
