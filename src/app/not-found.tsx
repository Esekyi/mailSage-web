import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold mb-4 gradient-text">404 - Page Not Found</h1>
      <p className="text-xl mb-8 text-muted-foreground">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
      <Button asChild className="gradient-bg">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  )
}

