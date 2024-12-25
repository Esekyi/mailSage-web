'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold mb-4 gradient-text">Oops! Something went wrong.</h1>
      <p className="text-xl mb-8 text-muted-foreground">We apologize for the inconvenience.</p>
      <Button onClick={() => reset()} className="gradient-bg">Try again</Button>
    </div>
  )
}
