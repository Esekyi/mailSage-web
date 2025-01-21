"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { AlertTriangle, MoreVertical } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { type APIKey } from "@/types/api-keys"
import { formatNumber } from "@/lib/utils"
import { useApiKeys } from "@/hooks/useApiKeys"

interface ApiKeyDisplayProps {
  apiKey: APIKey
  onRevoke: (id: number) => Promise<void>
  dailyUsage?: number
  dailyLimit?: number
}

export function ApiKeyDisplay({ apiKey, onRevoke }: ApiKeyDisplayProps) {
  const [showRevokeDialog, setShowRevokeDialog] = useState(false)
  const [isRevoking, setIsRevoking] = useState(false)
  const { success, error } = useToast()
  const { useApiKeyUsage } = useApiKeys()
  const { data: usage } = useApiKeyUsage(apiKey.id, 30)

  const handleRevoke = async () => {
    try {
      setIsRevoking(true)
      await onRevoke(apiKey.id)
      success({
        description: "API key revoked successfully",
      })
      setShowRevokeDialog(false)
    } catch {
      error({
        description: "Failed to revoke API key",
      })
    } finally {
      setIsRevoking(false)
    }
  }

  const dailyUsage = usage?.usage_stats.current_daily_requests ?? 0
  const dailyLimit = usage?.usage_stats.daily_limit ?? 100
  const usagePercentage = (dailyUsage / dailyLimit) * 100
  const remainingRequests = dailyLimit - dailyUsage
  const dailyAverage = usage?.usage_stats.daily_average ?? 0

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{apiKey.name}</h3>
                <Badge variant={apiKey.key_type === "live" ? "default" : "secondary"}>
                  {apiKey.key_type}
                </Badge>
                {apiKey.expires_at && (
                  <Badge variant="outline">
                    Expires {formatDistanceToNow(new Date(apiKey.expires_at), { addSuffix: true })}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Created {formatDistanceToNow(new Date(apiKey.created_at), { addSuffix: true })}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setShowRevokeDialog(true)}
                >
                  Revoke API Key
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <div>Daily Usage</div>
              <div>
                {formatNumber(dailyUsage)} / {formatNumber(dailyLimit)} requests
              </div>
            </div>
            <Progress value={usagePercentage} className="mt-2" />
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <div>{formatNumber(remainingRequests)} requests remaining today</div>
              <div>Daily average: {formatNumber(dailyAverage)} requests</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium">Permissions</div>
            <div className="flex flex-wrap gap-2">
              {apiKey.permissions.map((permission) => (
                <Badge key={permission} variant="secondary">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <span className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  This action cannot be undone.
                </span>
                Are you sure you want to revoke this API key? Any applications using this key will
                no longer be able to access the API.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              disabled={isRevoking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRevoking ? "Revoking..." : "Revoke Key"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
