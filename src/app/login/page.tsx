"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { fetchApi, ApiError } from '@/lib/api-config'
import { Eye, EyeOff } from 'lucide-react'



interface LoginResponse {
  status: string;
  data: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user: {
      id: number;
      email: string;
      role: string;
      name: string;
      email_verified: boolean;
    };
    error?: {
      code?: string
    }
  };
}


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetchApi<LoginResponse>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (response.status === 'success') {
        if (!response.data.user.email_verified) {
          toast({
            title: "Email not verified",
            description: "Please verify your email before logging in.",
            variant: "destructive",
            action: (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/resend-verification')}
              >
                Resend Verification
              </Button>
            ),
          })
          router.push('/resend-verification')
          return
        }

        // Store tokens
        localStorage.setItem('authToken', response.data.access_token)
        localStorage.setItem('refreshToken', response.data.refresh_token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        router.push('/dashboard')

        // Show success toast
        toast({
          title: "Success",
          description: "Successfully logged in!",
          variant: "default",
        })
      }
    } catch (error) {
      const apiError = error as ApiError

      // Handle different types of errors
      if (apiError.message?.includes('Email not verified')) {
        // Validation errors
        toast({
          title: "Email Not Verified",
          description: "Please verify your email before logging in.",
          variant: "destructive",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/resend-verification')}
            >
              Resend Verification
            </Button>
          ),
        })
        router.push('/resend-verification')
        return
      }

      if (apiError.errors) {
        // Validation errors
        const errorMessage = Object.entries(apiError.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n')

        toast({
          title: "Validation Error",
          description: errorMessage,
          variant: "destructive",
        })

      } else {
        // General error (including invalid credentials)
        toast({
          title: "Error",
          description: apiError.message || "Login failed. Please check your credentials.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false) 
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm p-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 inset-y-0 flex items-center"
                >
                  {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
              </div>

            </div>
          </div>

          <div className='px-4'>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

