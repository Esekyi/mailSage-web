import { useEffect } from 'react'
import { useThemeContext } from '@/contexts/theme-context'
import { usePreferences } from './usePreferences'

export function useThemePreference() {
  const { theme, setTheme } = useThemeContext()
  const { preferences, updatePreferences, isLoading } = usePreferences()

  // Sync theme with preferences on initial load
  useEffect(() => {
    if (!isLoading && preferences?.theme && theme !== preferences.theme) {
      setTheme(preferences.theme)
    }
  }, [isLoading, preferences?.theme, setTheme, theme])

  const setThemeWithPreference = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    
    // Only update backend if theme has changed and it's not the initial load
    if (!isLoading && newTheme !== preferences?.theme) {
      await updatePreferences({ 
        theme: newTheme === 'system' ? null : newTheme 
      })
    }
  }

  return {
    theme,
    setTheme: setThemeWithPreference,
    preferredTheme: preferences?.theme,
    isLoading: !theme || isLoading
  }
}
