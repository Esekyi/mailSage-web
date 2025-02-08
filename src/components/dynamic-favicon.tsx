"use client"

import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export function DynamicFavicon() {
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme || theme

  useEffect(() => {
    const updateFavicon = () => {
      const svgFavicon = document.querySelector('link[rel="icon"][type="image/svg+xml"]') as HTMLLinkElement
      const pngFavicon = document.querySelector('link[rel="icon"][type="image/png"]') as HTMLLinkElement

      if (svgFavicon) {
        svgFavicon.href = currentTheme === 'dark' ? '/favicon-light.svg' : '/favicon-dark.svg'
      }

      if (pngFavicon) {
        pngFavicon.href = currentTheme === 'dark' ? '/favicon-light.png' : '/favicon-dark.png'
      }
    }

    updateFavicon()

    // Set up a MutationObserver to update the favicon when the theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && mutation.target === document.documentElement) {
          updateFavicon()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      observer.disconnect()
    }
  }, [currentTheme])

  return null
}

