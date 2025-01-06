'use client'

import { useState } from 'react'
import { useDeleteTemplate, useTemplates } from '@/hooks/useTemplates'
import { Template } from '@/types/template'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/data-table/data-table'
import { EditTemplateDialog } from './edit-template-dialog'
import { columns } from './columns'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { DeleteTemplateDialog } from '@/components/templates/delete-template-dialog'
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from '@/lib/api-config'

function LoadingState() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TemplatesPage() {
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc' as 'desc' | 'asc'
  })

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null)

  const { data, isLoading } = useTemplates(params)
  const deleteTemplate = useDeleteTemplate()
  const { success, error } = useToast()

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template)
    setIsEditDialogOpen(true)
    setIsCreateDialogOpen(false)
  }

  const handleDelete = async (template: Template) => {
    setTemplateToDelete(template)
  }

  const tableColumns = columns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onViewHistory: undefined
  })

  const handleCreate = () => {
    setSelectedTemplate(null)
    setIsCreateDialogOpen(true)
    setIsEditDialogOpen(false)
  }

  const handleConfirmDelete = async (template: Template) => {
    try {
      await deleteTemplate.mutateAsync(template.id)
      success({
        title: "Success",
        description: "Template deleted successfully"
      })
      setTemplateToDelete(null)
    } catch (err) {
      const apiError = err as ApiError
      error({
        title: "Error",
        description: apiError.message || "Failed to delete template",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Card>
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <Input
              placeholder="Search templates..."
              value={params.search}
              id="search"
              name="search"
              onChange={(e) => setParams(prev => ({
                ...prev,
                search: e.target.value,
                page: 1
              }))}
              className="max-w-sm"
            />
          </div>

          <Card>
            <div className="p-4">
              {isLoading ? (
                <div className="rounded-md border">
                  <LoadingState />
                </div>
              ) : data?.items?.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-sm text-muted-foreground mb-4">No templates found</div>
                  <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first template
                  </Button>
                </div>
              ) : (
                <DataTable
                  columns={tableColumns}
                  data={data?.items ?? []}
                  pageCount={data?.total_pages ?? 0}
                  currentPage={params.page}
                  perPage={params.per_page}
                  totalItems={data?.total ?? 0}
                  onPaginationChange={(newParams) =>
                    setParams(prev => ({ ...prev, ...newParams }))
                  }
                />
              )}
            </div>
          </Card>
        </div>
      </Card>

      <EditTemplateDialog
        template={selectedTemplate}
        open={isEditDialogOpen || isCreateDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditDialogOpen(false)
            setIsCreateDialogOpen(false)
            setSelectedTemplate(null)
          }
        }}
        mode={isCreateDialogOpen ? 'create' : 'edit'}
        onSuccess={() => {
          setIsEditDialogOpen(false)
          setIsCreateDialogOpen(false)
          setSelectedTemplate(null)
          // Refresh data
          setParams(prev => ({ ...prev }))
        }}
      />
      <DeleteTemplateDialog
        template={templateToDelete}
        open={!!templateToDelete}
        onOpenChange={(open) => !open && setTemplateToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
