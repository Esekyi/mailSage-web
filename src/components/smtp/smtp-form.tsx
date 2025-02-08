import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Loader2, Eye, EyeOff, Mail, Globe, Hash } from 'lucide-react'
import { CreateSMTPConfig, SMTPConfig } from '@/types/smtp'
import { omit } from 'lodash'
import { Label } from '@/components/ui/label'

// Separate schemas for each step
const step1Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  from_email: z.string().email('Invalid email address').min(1, 'From email is required'),
})

// Add SMTP presets
const SMTP_PRESETS = {
  GMAIL: {
    host: 'smtp.gmail.com',
    port: 587,
    use_tls: true,
  },
  OUTLOOK: {
    host: 'smtp.office365.com',
    port: 587,
    use_tls: true,
  },
  // Add more presets as needed
}

// Add host validation
const step2Schema = z.object({
  host: z.string().min(1, 'Host is required')
    .refine(value => {
      // Add specific validation for known SMTP providers
      if (value.toLowerCase().includes('gmail')) {
        return value === 'smtp.gmail.com'
      }
      return value.includes('.')
    }, {
      message: 'Invalid host. For Gmail, use smtp.gmail.com'
    }),
  port: z.coerce.number()
    .min(1, 'Port is required')
    .max(65535, 'Port must be between 1 and 65535'),
  username: z.string().email('Username must be a valid email address').min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

const step2EditSchema = step2Schema

const step3Schema = z.object({
  use_tls: z.boolean().default(true),
  is_default: z.boolean().default(false),
  daily_limit: z.coerce.number().optional(),
})

// Create separate schemas for create and edit
const createSmtpSchema = step1Schema.merge(step2Schema).merge(step3Schema)
const editSmtpSchema = step1Schema.merge(step2EditSchema).merge(step3Schema)

interface SMTPFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateSMTPConfig) => Promise<void>;
  isSubmitting: boolean;
  initialData?: SMTPConfig;
  mode?: 'create' | 'edit';
}

type FormData = z.infer<typeof createSmtpSchema>

const defaultValues: FormData = {
  name: '',
  host: '',
  port: 587,
  username: '',
  password: '',
  from_email: '',
  use_tls: true,
  is_default: false,
  daily_limit: undefined,
}

export function SMTPForm({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialData,
  mode = 'create'
}: SMTPFormProps) {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)

  // Initialize form with proper values
  const form = useForm<FormData>({
    resolver: zodResolver(mode === 'create' ? createSmtpSchema : editSmtpSchema),
    defaultValues: defaultValues,
  })

  // Update form values when initialData changes or dialog opens
  useEffect(() => {
    if (initialData && open) {
      form.reset({
        name: initialData.name,
        host: initialData.host,
        port: initialData.port,
        username: initialData.username,
        password: '', // Password is intentionally empty in edit mode
        from_email: initialData.from_email,
        use_tls: initialData.use_tls,
        is_default: initialData.is_default,
        daily_limit: initialData.daily_limit || undefined,
      })
    } else if (!open) {
      form.reset(defaultValues)
      setStep(1)
    }
  }, [initialData, open, form])

  const handleSubmit = async (data: FormData) => {
    if (step < 3) {
      setStep(step + 1)
      return
    }
    try {
      // Only include password if it's provided in edit mode
      const submitData = mode === 'edit' && !data.password ?
        omit(data, ['password']) as CreateSMTPConfig :
        data as CreateSMTPConfig

      await onSubmit(submitData)
      onOpenChange(false)
    } catch (_error) {
      // Error handling is done in the parent component
      console.error('Error submitting SMTP form:', _error)
    }
  }

  const handleNext = async () => {
    let isValid = false
    const currentValues = form.getValues()

    // Validate only the fields for the current step
    if (step === 1) {
      isValid = await form.trigger(['name', 'from_email'])
      if (isValid) {
        const result = step1Schema.safeParse({
          name: currentValues.name,
          from_email: currentValues.from_email,
        })
        isValid = result.success
      }
    } else if (step === 2) {
      // Different validation for edit mode
      const fieldsToValidate = ['host', 'port', 'username']
      if (mode === 'create' || currentValues.password) {
        fieldsToValidate.push('password')
      }

      isValid = await form.trigger(fieldsToValidate)
      if (isValid) {
        const schema = mode === 'create' ? step2Schema : step2EditSchema
        const result = schema.safeParse({
          host: currentValues.host,
          port: currentValues.port,
          username: currentValues.username,
          password: currentValues.password,
        })
        isValid = result.success
      }
    }

    if (isValid) {
      setStep(step + 1)
    }
  }

  // Add preset selection
  const handlePresetSelect = (preset: keyof typeof SMTP_PRESETS) => {
    const presetConfig = SMTP_PRESETS[preset]
    form.setValue('host', presetConfig.host)
    form.setValue('port', presetConfig.port)
    form.setValue('use_tls', presetConfig.use_tls)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New SMTP' : 'Edit SMTP'}</DialogTitle>
          <DialogDescription>
            {step === 1 && "Enter basic information for your SMTP configuration."}
            {step === 2 && "Configure your SMTP server details."}
            {step === 3 && "Set additional options for your SMTP configuration."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input {...field} placeholder="My SMTP Server" />
                          <Mail className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="from_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input {...field} type="email" placeholder="noreply@example.com" />
                          <Mail className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-4">
                  <Label>Quick Setup</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetSelect('GMAIL')}
                    >
                      Gmail
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetSelect('OUTLOOK')}
                    >
                      Outlook
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Host</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input {...field} placeholder="smtp.gmail.com" />
                          <Globe className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        For Gmail, use smtp.gmail.com
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Port</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input {...field} type="number" placeholder="587" />
                            <Hash className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="use_tls"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Use TLS</FormLabel>
                          <FormDescription>
                            Required for Gmail
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input {...field} type="email" placeholder="your.email@gmail.com" />
                          <Mail className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        For Gmail, use your full email address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder={mode === 'edit' ? "Leave blank to keep existing password" : "Enter password"}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        {mode === 'create' ? (
                          'For Gmail, use an App Password if 2FA is enabled'
                        ) : (
                          'Leave blank to keep the existing password'
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 3 && (
              <>
                <FormField
                  control={form.control}
                  name="use_tls"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Use TLS</FormLabel>
                        <FormDescription>
                          Enable TLS encryption for secure email transmission
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_default"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Set as Default</FormLabel>
                        <FormDescription>
                          Use this SMTP server as the default for sending emails
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="daily_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Email Limit</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="Optional" />
                      </FormControl>
                      <FormDescription>
                        Maximum number of emails to send per day (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter>
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={isSubmitting}
                >
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    mode === 'create' ? 'Create SMTP' : 'Update SMTP'
                  )}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
