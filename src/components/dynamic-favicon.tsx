"use client"

import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export function DynamicFavicon() {
  const { theme } = useTheme()

  useEffect(() => {
    const updateFavicon = () => {
      const svgFavicon = document.querySelector('link[rel="icon"][type="image/svg+xml"]') as HTMLLinkElement
      const pngFavicon = document.querySelector('link[rel="alternate icon"][type="image/png"]') as HTMLLinkElement

      if (svgFavicon) {
        svgFavicon.href = theme === 'dark' ? '/favicon-light.svg' : '/favicon-dark.svg'
      }

      if (pngFavicon) {
        pngFavicon.href = theme === 'dark' ? '/favicon-light.png' : '/favicon-dark.png'
      }
    }
    updateFavicon()

    // Set up a MutationObserver to update the favicon when the theme changes
    const observer = new MutationObserver(updateFavicon)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      observer.disconnect()
    }
  }, [theme])

  return null
}

