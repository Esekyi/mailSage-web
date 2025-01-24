'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDocs } from '@/hooks/useDocs'
import { Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { DocError } from '@/components/docs/content/doc-error'

export default function DocsPage() {
  const router = useRouter()
  const { docs, isLoading, error } = useDocs()

  useEffect(() => {
    // Redirect to the first available doc
    if (docs?.sections?.[0]?.items?.[0]?.slug) {
      router.push(`/docs/${docs.sections[0].items[0].slug}`)
    }
  }, [docs, router])

  if (error) {
    return (
      <div className="space-y-6">
        <DocError
          type="error"
          title="Connection Error"
          message="We're unable to connect to the documentation server. Please check your internet connection and try again later."
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            className="pl-10 w-full max-w-2xl"
            disabled
          />
        </div>
        <Card>
          <CardContent className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documentation..."
          className="pl-10 w-full max-w-2xl"
        />
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to the Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            Learn how to integrate and use MailSage effectively. Select a topic from the sidebar to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
