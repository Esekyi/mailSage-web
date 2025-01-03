import { useState } from 'react'
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
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { ApiKeyDisplay } from './api-key-display'
import type { CreateAPIKeyResponse } from '@/types/api-keys'

interface CreateApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => Promise<CreateAPIKeyResponse>;
  isSubmitting: boolean;
}

export function CreateApiKeyDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: CreateApiKeyDialogProps) {
  const [name, setName] = useState('')
  const [createdKey, setCreatedKey] = useState<CreateAPIKeyResponse | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await onSubmit(name)
      setCreatedKey(response)
    } catch (error) {
      // Error is handled by the useApiKeys hook
    }
  }

  const handleClose = () => {
    setName('')
    setCreatedKey(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {createdKey ? 'API Key Created' : 'Create New API Key'}
          </DialogTitle>
          <DialogDescription>
            {createdKey
              ? "Copy your API key now. You won't be able to see it again!"
              : 'Create a new API key to authenticate your requests.'}
          </DialogDescription>
        </DialogHeader>

        {createdKey ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <ApiKeyDisplay apiKey={createdKey.api_key} />
              <p className="text-sm text-muted-foreground">
                Make sure to copy your API key now. For security reasons, you won&apos;t be able to see it again.
              </p>
            </div>
          </div>
        ) : (
          <form id="create-api-key-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Key Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Production API Key"
                required
              />
            </div>
          </form>
        )}

        <DialogFooter>
          {createdKey ? (
            <Button onClick={handleClose}>Done</Button>
          ) : (
            <Button
              form="create-api-key-form"
              type="submit"
              disabled={isSubmitting || !name}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create API Key'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
