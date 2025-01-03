"use client"

import { useState } from 'react'
import { useSmtp } from '@/hooks/useSmtp'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, Plus, Star, StarOff, Send, Trash2, PlusCircle, Pencil } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
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
import { SMTPForm } from '@/components/smtp/smtp-form'
import { TestSMTPDialog } from '@/components/smtp/test-smtp-dialog'
import { SMTPConfig, CreateSMTPConfig } from '@/types/smtp'

export default function SMTPPage() {
  const {
    smtpConfigs,
    isLoading,
    deleteSmtp,
    testSmtp,
    setDefaultSmtp,
    isDeleting,
    isTesting,
    isSettingDefault,
    createSmtp,
    updateSmtp,
    isCreating,
    isUpdating,
  } = useSmtp()

  const [selectedConfig, setSelectedConfig] = useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showTestDialog, setShowTestDialog] = useState(false)
  const [selectedTestConfig, setSelectedTestConfig] = useState<number | null>(null)
  const [editingConfig, setEditingConfig] = useState<SMTPConfig | null>(null)

  const handleDelete = async () => {
    if (!selectedConfig) return
    await deleteSmtp(selectedConfig)
    setShowDeleteDialog(false)
    setSelectedConfig(null)
  }

  const handleTest = async (toEmail: string) => {
    if (!selectedTestConfig) return
    await testSmtp({ id: selectedTestConfig, to_email: toEmail })
    setShowTestDialog(false)
    setSelectedTestConfig(null)
  }

  const handleEdit = async (data: CreateSMTPConfig) => {
    if (!editingConfig) return
    await updateSmtp({ id: editingConfig.id, ...data })
    setEditingConfig(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!smtpConfigs.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">No SMTP Configurations</h2>
          <p className="text-muted-foreground">
            Add your first SMTP server to start sending emails
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add SMTP Configuration
        </Button>
        <SMTPForm
          open={showAddForm}
          onOpenChange={setShowAddForm}
          onSubmit={createSmtp}
          isSubmitting={isCreating}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SMTP Configurations</h2>
          <p className="text-muted-foreground">Manage your SMTP servers for sending emails</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New SMTP
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SMTP Servers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>From Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {smtpConfigs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {config.name}
                      {config.is_default && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{config.host}</TableCell>
                  <TableCell>{config.from_email}</TableCell>
                  <TableCell>
                    <Badge variant={config.is_active ? "success" : "destructive"}>
                      {config.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress
                        value={(config.emails_sent_today / config.daily_limit) * 100}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {config.emails_sent_today} / {config.daily_limit} emails today
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {config.last_used_at ? (
                      formatDistanceToNow(new Date(config.last_used_at), { addSuffix: true })
                    ) : (
                      "Never"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTestConfig(config.id)
                          setShowTestDialog(true)
                        }}
                        disabled={isTesting}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDefaultSmtp(config.id)}
                        disabled={config.is_default || isSettingDefault}
                      >
                        {config.is_default ? (
                          <Star className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingConfig(config)}
                        disabled={isUpdating}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedConfig(config.id)
                          setShowDeleteDialog(true)
                        }}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SMTPForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onSubmit={createSmtp}
        isSubmitting={isCreating}
      />

      <TestSMTPDialog
        open={showTestDialog}
        onOpenChange={setShowTestDialog}
        onTest={handleTest}
        isTesting={isTesting}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the SMTP configuration. You can restore it later from the deleted items page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SMTPForm
        open={!!editingConfig}
        onOpenChange={(open) => !open && setEditingConfig(null)}
        onSubmit={handleEdit}
        isSubmitting={isUpdating}
        initialData={editingConfig || undefined}
        mode="edit"
      />
    </div>
  )
}

