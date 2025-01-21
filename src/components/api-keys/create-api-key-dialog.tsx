"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Check, Copy, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { API_KEY_PERMISSIONS, API_KEY_EXPIRY_OPTIONS, ALL_PERMISSIONS, type APIKeyPermission, type CreateAPIKeyRequest } from "@/types/api-keys"
import { Checkbox } from "@/components/ui/checkbox"

interface CreateApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateAPIKeyRequest) => Promise<{ key: string }>
  isSubmitting: boolean
}

interface ShowApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apiKey: string | null
}

type FormValues = {
  name: string
  key_type: "test" | "live"
  permissions: Array<APIKeyPermission | 'full_access'>
  expires_in_days: number | null
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  key_type: z.enum(["test", "live"] as const),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
  expires_in_days: z.number().nullable(),
})

export function ShowApiKeyDialog({ open, onOpenChange, apiKey }: ShowApiKeyDialogProps) {
  const [copied, setCopied] = useState(false)
  const { success } = useToast()

  const handleCopy = async () => {
    if (!apiKey) return
    await navigator.clipboard.writeText(apiKey)
    setCopied(true)
    success({
      description: "API key copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Key Created</DialogTitle>
          <DialogDescription>
            Copy your API key now. You won&apos;t be able to see it again!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <pre className="text-sm font-mono break-all whitespace-pre-wrap">
              {apiKey}
            </pre>
          </div>
          <div className="text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>This key will only be shown once</li>
              <li>Store it securely</li>
              <li>Never share it publicly</li>
            </ul>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function CreateApiKeyDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: CreateApiKeyDialogProps) {
  const [showKey, setShowKey] = useState(false)
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      key_type: "test",
      permissions: [],
      expires_in_days: 30,
    },
  })

  const handleSubmit = async (values: FormValues) => {
    try {
      const requestData = {
        name: values.name,
        key_type: values.key_type,
        permissions: values.permissions.includes('full_access')
          ? ALL_PERMISSIONS
          : values.permissions.filter((p): p is APIKeyPermission => p !== 'full_access'),
        ...(values.expires_in_days && values.expires_in_days > 0 && {
          expires_in_days: values.expires_in_days
        })
      }
      const response = await onSubmit(requestData)
      setCreatedKey(response.key)
      setShowKey(true)
      form.reset()
    } catch {
      // Error handling is done in the hook
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Create a new API key for accessing the API. Choose permissions and expiry carefully.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Production API Key" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="key_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select key type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="test">Test</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <div className="space-y-2">
                      {API_KEY_PERMISSIONS.map((permission) => (
                        <div key={permission.value} className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value.includes(permission.value as APIKeyPermission | 'full_access')}
                            onCheckedChange={(checked: boolean) => {
                              const current = new Set(field.value)
                              if (permission.value === 'full_access') {
                                if (checked) {
                                  field.onChange(['full_access'])
                                } else {
                                  field.onChange([])
                                }
                              } else {
                                // If full access is selected, remove it when selecting individual permissions
                                if (current.has('full_access')) {
                                  current.delete('full_access')
                                }
                                if (checked) {
                                  current.add(permission.value as APIKeyPermission)
                                } else {
                                  current.delete(permission.value)
                                }
                                field.onChange(Array.from(current))
                              }
                            }}
                          />
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {permission.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expires_in_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value === "0" ? null : parseInt(value))
                      }}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select expiry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {API_KEY_EXPIRY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create API Key
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ShowApiKeyDialog
        open={showKey}
        onOpenChange={(open) => {
          setShowKey(open)
          if (!open) {
            onOpenChange(false)
          }
        }}
        apiKey={createdKey}
      />
    </>
  )
}
