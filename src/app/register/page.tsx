"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ApiError, api, apiConfig } from '@/lib/api-config'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { toast } from 'sonner'


// Types
interface User {
  id: number
  email: string
  name: string
  role: string
}

interface RegisterResponse {
  user: User
  message: string
}

interface PasswordRequirement {
  test: RegExp | ((value: string) => boolean);
  text: string;
}


const passwordRequirements: PasswordRequirement[] = [
  { test: /.{8,}/, text: "At least 8 characters" },
  { test: /[A-Z]/, text: "At least one uppercase letter" },
  { test: /[a-z]/, text: "At least one lowercase letter" },
  { test: /[0-9]/, text: "At least one number" },
  { test: /[^A-Za-z0-9]/, text: "At least one special character" },
];

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    website: '' // honeypot field
  })

  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [validations, setValidations] = useState({
    password: new Array(passwordRequirements.length).fill(false),
    passwordStrength: 0,
    passwordsMatch: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter()

  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0

    const metRequirements = passwordRequirements.filter(req =>
      req.test instanceof RegExp ?
        req.test.test(password) :
        req.test(password)
    ).length

    return (metRequirements / passwordRequirements.length) * 100
  }

  useEffect(() => {
    // Update password validations
    const newValidations = passwordRequirements.map(req =>
      req.test instanceof RegExp ?
        req.test.test(formData.password) :
        req.test(formData.password)
    )

    setValidations(prev => ({
      ...prev,
      password: newValidations,
      passwordStrength: calculatePasswordStrength(formData.password),
      passwordsMatch: formData.password === formData.confirmPassword && formData.password !== ''
    }))
  }, [formData.password, formData.confirmPassword])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName)
  }

  const handleBlur = () => {
    setFocusedField(null)
  }

  const getStrengthColor = (strength: number): string => {
    if (strength < 40) return 'bg-destructive'
    if (strength < 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // If honeypot field is filled, silently fail
      if (formData.website) {
        // Simulate success but do nothing
        toast.success("Registration Successful", {
          description: "Please check your email to verify your account."
        })
        return
      }

      // Client-side validation
      if (!validations.password.every(v => v)) {
        throw {
          status: 'error',
          message: 'Password does not meet requirements',
          errors: { password: ['Password must meet all requirements'] }
        } as ApiError
      }

      if (!validations.passwordsMatch) {
        throw {
          status: 'error',
          message: 'Passwords do not match',
          errors: { confirmPassword: ['Passwords must match'] }
        } as ApiError
      }

      // Remove confirmPassword and honeypot field before sending to API
      const { confirmPassword, website, ...registerPayload } = {
        ...formData,
        email: formData.email.toLowerCase(),
        name: formData.name.charAt(0).toUpperCase() + formData.name.slice(1)
      }

      await api.post<RegisterResponse, typeof registerPayload>(
        apiConfig.endpoints.auth.register,
        registerPayload
      )

      toast.success("Registration Successful", {
        description: "Please check your email to verify your account.",
        action: {
          label: "Resend verification email",
          onClick: () => router.push('/resend-verification')
        }
      })

      router.push('/login')

    } catch (err) {
      const apiError = err as ApiError

      if (apiError.errors) {
        const errorMessages = Object.entries(apiError.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n')

        toast.error("Registration Failed", {
          description: errorMessages,
        })
      } else {
        toast.error("Registration Failed", {
          description: apiError.message || "Failed to create account. Please try again.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 mb-2">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join MailSage to start sending emails
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm p-4">
            <div className="hidden">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="text"
                autoComplete="off"
                value={formData.website}
                onChange={handleChange}
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className={
                    `mt-1 ${formData.password && validations.password.every(v => v)
                      ? 'border-green-500'
                      : formData.password
                        ? 'border-destructive'
                    : ''}`
                  }
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
              {(focusedField === 'password' || formData.password) && (
                <div className="mt-2 space-y-2">
                  <Progress
                    value={validations.passwordStrength}
                    className={`h-1 w-full ${getStrengthColor(validations.passwordStrength)}`}
                  />
                  {passwordRequirements.map((req, index) => (
                    <div key={req.text} className="flex items-center space-x-2">
                      {validations.password[index] ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                          <X className="h-4 w-4 text-destructive" />
                      )}
                      <span className={`text-sm ${
                        validations.password[index] ? 'text-green-500' : 'text-destructive'
                        }`}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="password">Confirm Password</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className={
                    `mt-1 ${formData.password && validations.password.every(v => v)
                      ? 'border-green-500'
                      : formData.password
                        ? 'border-destructive'
                        : ''
                    }`
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 inset-y-0 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center space-x-2">
                  {validations.passwordsMatch ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">Passwords match</span>
                    </>
                  ) : (
                      <>
                        <X className="h-4 w-4 text-destructive" />
                        <span className="text-sm text-destructive">Passwords do not match</span>
                      </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className='px-4'>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !validations.password.every(v => v) || !validations.passwordsMatch}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}
