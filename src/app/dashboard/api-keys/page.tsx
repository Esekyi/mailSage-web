"use client"

import { useState } from 'react'
import { useApiKeys } from '@/hooks/useApiKeys'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { CreateApiKeyDialog } from '@/components/api-keys/create-api-key-dialog'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Key } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function APIKeysPage() {
  const {
    apiKeys,
    isLoading,
    createApiKey,
    revokeApiKey,
    isCreating,
    isRevoking,
  } = useApiKeys()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null)
  const [showRevokeDialog, setShowRevokeDialog] = useState(false)

  const handleCreate = async (name: string) => {
    return await createApiKey({ name })
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
                  <TableHead>Last Used</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>{key.name}</TableCell>
                    <TableCell>
                      {key.last_used_at ? (
                        formatDistanceToNow(new Date(key.last_used_at), { addSuffix: true })
                      ) : (
                        "Never"
                      )}
                    </TableCell>
                    <TableCell>
                      {key.expires_at ? (
                        <Badge variant={
                          new Date(key.expires_at) < new Date() ? "destructive" : "secondary"
                        }>
                          {formatDistanceToNow(new Date(key.expires_at), { addSuffix: true })}
                        </Badge>
                      ) : (
                        "Never"
                      )}
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
        onSubmit={handleCreate}
        isSubmitting={isCreating}
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

