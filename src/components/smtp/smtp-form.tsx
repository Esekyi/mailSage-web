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
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { CreateSMTPConfig, SMTPConfig } from '@/types/smtp'
import { omit } from 'lodash'

// Separate schemas for each step
const step1Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  from_email: z.string().email('Invalid email address'),
})

const step2Schema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().min(1, 'Port is required'),
  username: z.string().min(1, 'Username is required'),
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
    } catch (error) {
      // Error handling is done in the parent component
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
                        <Input {...field} placeholder="My SMTP Server" />
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
                        <Input {...field} type="email" placeholder="noreply@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Host</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="smtp.example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Port</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="587" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Password {mode === 'edit' && "(Enter your SMTP password)"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
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
