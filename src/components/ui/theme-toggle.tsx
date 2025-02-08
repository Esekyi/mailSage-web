'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { usePreferences } from '@/hooks/usePreferences'

interface ThemeToggleProps {
  variant?: 'default' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  permanent?: boolean
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({
  variant = 'ghost',
  size = 'icon',
  permanent = false,
  className,
  showLabel = false
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const { preferences, updatePreferences } = usePreferences()

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    if (permanent && preferences) {
      updatePreferences({
        ...preferences,
        theme: newTheme
      })
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
      className={className}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      {showLabel && (
        <>
          <span className="ml-2 font-normal">Toggle theme</span>
          <span className="sr-only">
            {permanent ? 'Change theme preference' : 'Toggle theme'}
          </span>
        </>
      )}
    </Button>
  )
}
