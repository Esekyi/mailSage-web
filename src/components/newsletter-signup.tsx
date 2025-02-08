'use client'

import { useState, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { axiosInstance } from '@/lib/axios'
import ReCAPTCHA from 'react-google-recaptcha'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'

const formSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must not exceed 100 characters'),
  // Honeypot field - should remain empty
  username: z.string().max(0, 'This field should be empty'),
})

type FormData = z.infer<typeof formSchema>

interface ApiError {
  response?: {
    status: number;
    data?: {
      error?: string;
      details?: string;
      message?: string;
      retry_after?: number;
    };
    statusText?: string;
  };
  message?: string;
}

export function NewsletterSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '', // Honeypot field
    },
  })

  const executeRecaptcha = useCallback(async () => {
    try {
      if (!recaptchaRef.current) {
        console.error('reCAPTCHA not initialized')
        return null
      }

      const token = await recaptchaRef.current.executeAsync()
      if (!token) {
        console.error('reCAPTCHA execution returned empty token')
        return null
      }
      console.log('reCAPTCHA executed successfully')
      return token
    } catch (error) {
      console.error('reCAPTCHA execution error:', error)
      return null
    }
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      // Check if honeypot field is filled (likely a bot)
      if (data.username) {
        console.log('Honeypot triggered')
        return
      }

      setIsSubmitting(true)

      // Execute reCAPTCHA
      console.log('Executing reCAPTCHA...')
      const token = await executeRecaptcha()
      console.info('reCAPTCHA token:', token)

      if (!token) {
        setIsSubmitting(false) // Reset submit state if reCAPTCHA fails
        toast.error('Please complete the verification to subscribe.')
        return
      }

      console.log('Sending newsletter subscription request...')
      const response = await axiosInstance.post('/api/v1/blog/newsletter/subscribe', {
        email: data.email.toLowerCase(),
        captchaToken: token,
      })

      console.log('Newsletter subscription response:', response)

      // Handle different success cases
      if (response.status === 201) {
        // New subscription created
        toast.success(response.data.message)
        form.reset()
      } else if (response.status === 200) {
        // Subscription reactivated
        toast.success(response.data.message)
        form.reset()
      }
    } catch (error: unknown) {
      const apiError = error as ApiError
      console.error('Newsletter subscription error:', {
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        data: apiError.response?.data,
        message: apiError.message
      })

      // Handle different error scenarios
      if (apiError.response?.status === 400) {
        const errorData = apiError.response.data

        // Check for already subscribed case first
        if (errorData?.message === "This email is already subscribed") {
          toast.info(errorData.message)
          form.reset()
          return
        }

        // Handle other error cases
        if (!errorData || Object.keys(errorData).length === 0) {
          toast.error('Subscription failed. Please try again.')
        } else if (errorData.error === 'Captcha verification failed') {
          toast.error(errorData.details || 'Verification failed. Please try again.')
        } else {
          toast.error(errorData.error || 'Failed to subscribe. Please try again.')
        }
      } else if (apiError.response?.status === 429) {
        const retryAfter = apiError.response.data?.retry_after || 0
        const minutes = Math.ceil(retryAfter / 60)
        toast.error(
          'Too many attempts. Please try again later.',
          { description: `You can try again in ${minutes} minutes.` }
        )
      } else {
        toast.error('An unexpected error occurred. Please try again later.')
      }
    } finally {
      setIsSubmitting(false)
      recaptchaRef.current?.reset() // Always reset reCAPTCHA after attempt
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        {/* Hidden honeypot field */}
        <div className="hidden">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    autoComplete="off"
                    tabIndex={-1}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Visible email field */}
        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="gradient-bg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>

        {/* Invisible reCAPTCHA */}
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
          badge="bottomright"
          onErrored={() => {
            console.error('reCAPTCHA error occurred')
            setIsSubmitting(false) // Reset submit state on error
            toast.error('Verification error. Please try again.')
          }}
          onExpired={() => {
            console.log('reCAPTCHA expired')
            setIsSubmitting(false) // Reset submit state on expiry
            toast.error('Verification expired. Please try again.')
          }}
          onChange={(token: string | null) => {
            if (!token) {
              setIsSubmitting(false) // Reset submit state if user cancels
            }
          }}
        />
      </form>
    </Form>
  )
}
