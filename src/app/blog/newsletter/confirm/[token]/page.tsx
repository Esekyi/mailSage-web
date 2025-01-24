import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Confirm Newsletter Subscription - MailSage',
  description: 'Confirm your subscription to the MailSage newsletter',
  robots: 'noindex'
}

interface ConfirmResponse {
  success: boolean
  message: string
  email?: string
}

async function confirmSubscription(token: string): Promise<ConfirmResponse> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/blog/newsletter/confirm/${token}`, {
      method: 'GET',
      cache: 'no-store'
    })

    if (!res.ok) {
      throw new Error('Failed to confirm subscription')
    }

    return res.json()
  } catch (error) {
    return {
      success: false,
      message: 'Failed to confirm your subscription. The link may be expired or invalid.'
    }
  }
}

export default async function NewsletterConfirmPage({ params }: { params: { token: string } }) {
  const result = await confirmSubscription(params.token)

  return (
    <main className="container max-w-lg mx-auto px-4 py-16">
      <Card className="p-6">
        <div className="flex flex-col items-center text-center gap-6">
          {result.message ? (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Subscription Confirmed!</h1>
                <p className="text-muted-foreground">
                  Thank you for subscribing to our newsletter. You&apos;ll now receive our latest blog posts and updates at{' '}
                  <span className="font-medium text-foreground">{result.email}</span>.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">What&apos;s next?</p>
                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <Link href="/blog">
                      Read Our Latest Posts
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">
                      Explore MailSage
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-destructive" />
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Confirmation Failed</h1>
                <p className="text-muted-foreground">
                  {result.message}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Need help?</p>
                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <Link href="/blog">
                      Return to Blog
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/contact">
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </main>
  )
}
