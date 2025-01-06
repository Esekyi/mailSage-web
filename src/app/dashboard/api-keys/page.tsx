"use client"

import { useState } from "react"
import { useApiKeys } from "@/hooks/useApiKeys"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Key } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { CreateApiKeyDialog } from "@/components/api-keys/create-api-key-dialog"
import { ApiKeyDisplayDialog } from "@/components/api-keys/api-key-display"
import { CreateAPIKeyRequest, CreateAPIKeyResponse, ALL_PERMISSIONS, type APIKeyPermission } from "@/types/api-keys"

function isFullAccess(permissions: APIKeyPermission[]) {
  return ALL_PERMISSIONS.every(p => permissions.includes(p))
}

function PermissionBadges({ permissions }: { permissions: APIKeyPermission[] }) {
  if (isFullAccess(permissions)) {
    return (
      <Badge variant="default" className="bg-primary hover:bg-primary/90">Full Access</Badge>
    )
  }

  return (
    <div className="flex flex-wrap gap-1.5 max-w-[400px]">
      {permissions.map((permission) => {
        const formattedPermission = permission.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        let variant: "default" | "outline" | "secondary" = "secondary"
        let icon = null

        switch (permission) {
          case 'send_email':
            icon = "✉️"
            variant = "default"
            break
          case 'manage_templates':
            icon = "📝"
            break
          case 'manage_smtp':
            icon = "🔧"
            break
          case 'webhook_management':
            icon = "🔗"
            break
          case 'view_analytics':
            icon = "📊"
            break
        }

        return (
          <Badge
            key={permission}
            variant={variant}
            className="whitespace-nowrap text-xs py-0.5 px-2"
          >
            {icon && <span className="mr-1" style={{ fontSize: '11px' }}>{icon}</span>}
            {formattedPermission}
          </Badge>
        )
      })}
    </div>
  )
}

export default function ApiKeysPage() {
  const {
    apiKeys,
    isLoading,
    createApiKey,
    revokeApiKey,
    isCreating,
    isRevoking,
  } = useApiKeys()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showKeyDialog, setShowKeyDialog] = useState(false)
  const [createdKey, setCreatedKey] = useState<CreateAPIKeyResponse | null>(null)
  const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null)
  const [showRevokeDialog, setShowRevokeDialog] = useState(false)

  const handleCreateKey = async (data: CreateAPIKeyRequest) => {
    try {
      const response = await createApiKey(data)
      setCreatedKey(response)
      setShowCreateDialog(false)
      setShowKeyDialog(true)
    } catch (error) {
      // Error handling is done in useApiKeys hook
    }
  }

  const handleRevoke = async () => {
    if (!selectedKeyId) return
    await revokeApiKey(selectedKeyId)
    setShowRevokeDialog(false)
    setSelectedKeyId(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Keys</h2>
          <p className="text-muted-foreground">
            Manage your API keys for authentication
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </div>

      {!apiKeys.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
            <Key className="h-8 w-8 text-muted-foreground" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">No API Keys</h3>
              <p className="text-sm text-muted-foreground">
                Create your first API key to start making authenticated requests.
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              Create API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Daily Requests</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium max-w-[200px]">
                      <div className="truncate">{key.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.key_type === 'live' ? 'default' : 'secondary'}>
                        {key.key_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="truncate">
                        <PermissionBadges permissions={key.permissions} />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px]">
                      <div className="truncate">
                        {key.last_used_at ? (
                          formatDistanceToNow(new Date(key.last_used_at), { addSuffix: true })
                        ) : (
                          "Never"
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px]">
                      <div className="truncate">
                        {key.expires_at ? (
                          <Badge variant={
                            new Date(key.expires_at) < new Date() ? "destructive" : "secondary"
                          }>
                            {formatDistanceToNow(new Date(key.expires_at), { addSuffix: true })}
                          </Badge>
                        ) : (
                          "Never"
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px]">
                      <div className="truncate">{key.daily_requests}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedKeyId(key.id)
                          setShowRevokeDialog(true)
                        }}
                        disabled={isRevoking}
                      >
                        {isRevoking && selectedKeyId === key.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Revoke'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <CreateApiKeyDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateKey}
        isSubmitting={isCreating}
      />

      <ApiKeyDisplayDialog
        open={showKeyDialog}
        onOpenChange={setShowKeyDialog}
        apiKeyData={createdKey}
      />

      <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The API key will be immediately revoked and any applications using it will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

