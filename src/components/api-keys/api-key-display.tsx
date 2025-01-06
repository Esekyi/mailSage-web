"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreateAPIKeyResponse } from "@/types/api-keys"

interface ApiKeyDisplayDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apiKeyData: CreateAPIKeyResponse | null
}

export function ApiKeyDisplayDialog({
  open,
  onOpenChange,
  apiKeyData,
}: ApiKeyDisplayDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!apiKeyData?.key) return
    await navigator.clipboard.writeText(apiKeyData.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Key Created</DialogTitle>
          <DialogDescription>
            Copy your API key now. You won&apos;t be able to see it again!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <div className="text-sm font-mono break-all">{apiKeyData?.key}</div>
          </div>
          <div className="text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>This key will only be shown once</li>
              <li>Store it securely</li>
              <li>Never share it publicly</li>
              {apiKeyData?.api_key.expires_at && (
                <li>Expires: {new Date(apiKeyData.api_key.expires_at).toLocaleDateString()}</li>
              )}
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
