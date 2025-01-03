"use client"

import { useState } from 'react'
import { useDeletedItems } from '@/hooks/useDeletedItems'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Trash2, History } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ConfirmPermanentDeleteDialog } from '@/components/confirm-permanent-delete-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function DeletedItemsPage() {
  const {
    deletedItems,
    isLoading,
    restoreTemplate,
    restoreSmtp,
    permanentlyDeleteTemplate,
    permanentlyDeleteSmtp,
    permanentlyDeleteAllTemplates,
    permanentlyDeleteAllSmtps,
  } = useDeletedItems()

  const [selectedItem, setSelectedItem] = useState<{ id: number, type: 'template' | 'smtp' } | null>(null)
  const [deleteAllType, setDeleteAllType] = useState<'templates' | 'smtp configs' | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const handleRestore = async (id: number, type: 'template' | 'smtp') => {
    if (type === 'template') {
      await restoreTemplate(id)
    } else {
      await restoreSmtp(id)
    }
  }

  const handlePermanentDelete = async () => {
    if (!selectedItem) return
    if (selectedItem.type === 'template') {
      await permanentlyDeleteTemplate(selectedItem.id)
    } else {
      await permanentlyDeleteSmtp(selectedItem.id)
    }
    setSelectedItem(null)
  }

  const handleDeleteAll = async () => {
    if (!deleteAllType) return
    if (deleteAllType === 'templates') {
      await permanentlyDeleteAllTemplates()
    } else {
      await permanentlyDeleteAllSmtps()
    }
    setDeleteAllType(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Deleted Items</h2>
        <p className="text-muted-foreground">Manage your deleted templates and SMTP configurations</p>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates ({deletedItems?.templates.length || 0})</TabsTrigger>
          <TabsTrigger value="smtp">SMTP Configs ({deletedItems?.smtp_configs.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Deleted Templates</CardTitle>
              {deletedItems?.templates.length ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteAllType('templates')}
                >
                  Delete All Permanently
                </Button>
              ) : null}
            </CardHeader>
            <CardContent>
              {deletedItems?.templates.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Deleted At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deletedItems?.templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>{template.name}</TableCell>
                        <TableCell>{template.category || 'N/A'}</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(template.deleted_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestore(template.id, 'template')}
                          >
                            <History className="h-4 w-4 mr-1" />
                            Restore
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setSelectedItem({ id: template.id, type: 'template' })}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No deleted templates found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smtp">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Deleted SMTP Configurations</CardTitle>
              {deletedItems?.smtp_configs.length ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteAllType('smtp configs')}
                >
                  Delete All Permanently
                </Button>
              ) : null}
            </CardHeader>
            <CardContent>
              {deletedItems?.smtp_configs.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deletedItems?.smtp_configs.map((smtp) => (
                      <TableRow key={smtp.id}>
                        <TableCell>{smtp.name}</TableCell>
                        <TableCell>{smtp.host}</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(smtp.updated_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestore(smtp.id, 'smtp')}
                          >
                            <History className="h-4 w-4 mr-1" />
                            Restore
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setSelectedItem({ id: smtp.id, type: 'smtp' })}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No deleted SMTP configurations found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmPermanentDeleteDialog
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
        onConfirm={handlePermanentDelete}
        title={`Delete ${selectedItem?.type === 'template' ? 'Template' : 'SMTP Config'} Permanently`}
        description="This action cannot be undone. The item will be permanently deleted from the system."
        confirmationText="PERMANENT DELETE"
      />

      <ConfirmPermanentDeleteDialog
        open={!!deleteAllType}
        onOpenChange={(open) => !open && setDeleteAllType(null)}
        onConfirm={handleDeleteAll}
        title={`Delete All ${deleteAllType === 'templates' ? 'Templates' : 'SMTP Configs'} Permanently`}
        description="This action cannot be undone. All deleted items will be permanently removed from the system."
        confirmationText={`PERMANENT DELETE ALL ${deleteAllType?.toUpperCase()}`}
      />
    </div>
  )
}
