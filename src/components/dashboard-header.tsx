"use client"

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import dynamic from 'next/dynamic'

const Image = dynamic(() => import('next/image'), {ssr: false})

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Image
            src={theme === 'dark' ? '/navbarLogo-light.svg' : '/navbarLogo-dark.svg'}
            alt="mailSage Logo"
            width={32}
            height={32}
          />
          <span className="font-semibold gradient-text">mailSage</span>
        </Link>
        <nav className="ml-auto flex items-center space-x-4">
          <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Docs
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="bg-muted"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>
      </div>
    </header>
  )
}

