'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/blog/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() })
      })

      if (!res.ok) throw new Error()
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Subscribe to our newsletter</h3>
        <p className="text-sm text-muted-foreground">Get the latest posts delivered right to your inbox.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="max-w-sm"
        />
        <Button type="submit" disabled={status === 'loading'}>
          <Send className="mr-2 h-4 w-4" />
          Subscribe
        </Button>
      </form>

      {status === 'success' && (
        <p className="text-sm text-green-600 dark:text-green-500">
          Thanks for subscribing! Please check your email to confirm.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600 dark:text-red-500">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  )
}
