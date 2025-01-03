import { useState, useEffect } from 'react'
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

interface TestSMTPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTest: (toEmail: string) => Promise<void>;
  isTesting: boolean;
}

export function TestSMTPDialog({
  open,
  onOpenChange,
  onTest,
  isTesting
}: TestSMTPDialogProps) {
  const [email, setEmail] = useState("")

  // Reset email when dialog closes
  useEffect(() => {
    if (!open) {
      setEmail("")
    }
  }, [open])

  const handleTest = async () => {
    await onTest(email)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test SMTP Configuration</DialogTitle>
          <DialogDescription>
            Send a test email to verify your SMTP configuration.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="to_email">Test Email Address</Label>
            <Input
              id="to_email"
              type="email"
              placeholder="Enter email address"
              name='to_email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isTesting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleTest}
            disabled={isTesting || !email}
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Send Test Email'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
