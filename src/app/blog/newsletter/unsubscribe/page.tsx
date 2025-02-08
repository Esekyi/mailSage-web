'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { axiosInstance } from '@/lib/axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { AxiosError } from 'axios'

interface UnsubscribeResponse {
  message: string
  code: 'UNSUBSCRIBED' | 'NOT_SUBSCRIBED'
  email?: string
}

interface UnsubscribeError {
  error: string
  code: 'INVALID_TOKEN' | 'VALIDATION_ERROR' | 'SERVER_ERROR'
  details?: string
}

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [response, setResponse] = useState<UnsubscribeResponse | UnsubscribeError | null>(null)
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setResponse({
        error: 'Missing unsubscribe token',
        code: 'INVALID_TOKEN'
      })
      return
    }

    const unsubscribe = async () => {
      try {
        setStatus('loading')

        // Try to decode the email from base64
        try {
          const decodedEmail = atob(token)
          setEmail(decodedEmail)
        } catch (e) {
          console.error('Failed to decode email:', e)
        }

        const response = await axiosInstance.post('/api/v1/blog/newsletter/unsubscribe', {
          token
        })

        setStatus('success')
        setResponse(response.data)
        toast.success(response.data.message)
      } catch (error) {
        console.error('Unsubscribe error:', (error as AxiosError)?.response?.data)
        setStatus('error')
        const axiosError = error as AxiosError<UnsubscribeError>
        setResponse(axiosError.response?.data || {
          error: 'An unexpected error occurred',
          code: 'SERVER_ERROR'
        })
        toast.error(axiosError.response?.data?.error || 'Failed to unsubscribe')
      }
    }

    unsubscribe()
  }, [searchParams])

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Mail className="h-12 w-12 animate-pulse text-muted-foreground" />
      case 'success':
        return <CheckCircle2 className="h-12 w-12 text-green-500" />
      case 'error':
        return <XCircle className="h-12 w-12 text-destructive" />
      default:
        return <Mail className="h-12 w-12 text-muted-foreground" />
    }
  }

  const getContent = () => {
    switch (status) {
      case 'loading':
        return {
          title: 'Processing your request',
          description: 'Please wait while we unsubscribe you from our newsletter...'
        }
      case 'success':
        const successResponse = response as UnsubscribeResponse
        return {
          title: successResponse.code === 'UNSUBSCRIBED'
            ? 'Successfully Unsubscribed'
            : 'Already Unsubscribed',
          description: successResponse.message
        }
      case 'error':
        const errorResponse = response as UnsubscribeError
        return {
          title: 'Error',
          description: errorResponse.error,
          details: errorResponse.details
        }
      default:
        return {
          title: 'Newsletter Unsubscribe',
          description: 'Processing your request...'
        }
    }
  }

  const content = getContent()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-2xl">{content.title}</CardTitle>
          <CardDescription className="text-base mt-2">
            {content.description}
          </CardDescription>
          {content.details && (
            <div className="mt-4 p-4 rounded-lg bg-muted flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground text-left">
                {content.details}
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          {email && (
            <p className="text-sm text-muted-foreground">
              Email: {email}
            </p>
          )}
          {status !== 'loading' && (
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button asChild>
                <Link href="/">
                  Return to Homepage
                </Link>
              </Button>
              {status === 'error' && (
                <Button variant="outline" asChild>
                  <Link href="/contact">
                    Contact Support
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
