'use client'

import { createContext, useContext } from 'react'
import { useTheme } from 'next-themes'

type ThemeContextType = {
  theme: string | undefined
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: undefined,
  setTheme: () => null,
})

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const themeContext = useTheme()

  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeContextProvider')
  }
  return context
}
