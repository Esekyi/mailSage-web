// src/components/templates/edit-template-dialog.tsx

'use client'

import { useState, useEffect } from 'react'
import { Template } from '@/types/template'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useUpdateTemplate, useCreateTemplate } from '@/hooks/useTemplates'
import { useToast } from '@/hooks/use-toast'
import { TemplateEditor } from './template-editor'
import { TemplatePreview } from './templates-preview'
import { VersionHistory } from './version-history'
import { History, Save } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

interface EditTemplateDialogProps {
  template: Template | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  mode: 'create' | 'edit'
}

export function EditTemplateDialog({
  template,
  open,
  onOpenChange,
  onSuccess,
  mode
}: EditTemplateDialogProps) {
  const [editedTemplate, setEditedTemplate] = useState({
    name: '',
    description: '',
    html_content: '',
    change_summary: ''
  })

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [requiredVariables, setRequiredVariables] = useState<string[]>([])

  const updateTemplate = useUpdateTemplate()
  const createTemplate = useCreateTemplate()
  const { toast } = useToast()

  // Initialize form when template changes
  useEffect(() => {
    if (mode === 'create') {
      setEditedTemplate({
        name: '',
        description: '',
        html_content: '',
        change_summary: ''
      })
      setRequiredVariables([])
    } else if (template) {
      setEditedTemplate({
        name: template.name,
        description: template.description || '',
        html_content: template.html_content,
        change_summary: ''
      })
      setRequiredVariables(template.required_variables)
    }
  }, [template, mode])

  // Extract variables from HTML content
  useEffect(() => {
    const matches = editedTemplate.html_content.match(/{{(.*?)}}/g) || []
    const variables = matches.map(match => match.slice(2, -2).trim())
    setRequiredVariables([...new Set(variables)])
  }, [editedTemplate.html_content])

  const handleSave = async () => {

    try {
      const templateData = {
        name: editedTemplate.name,
        description: editedTemplate.description,
        html_content: editedTemplate.html_content,
      }

      if (mode === 'create') {
        await createTemplate.mutateAsync(templateData)
        toast({
          title: "Success",
          description: "Template created successfully",
        })
      } else {
        if (!template) return
        await updateTemplate.mutateAsync({
          templateId: template.id,
          data: { ...templateData, change_summary: editedTemplate.change_summary }
        })
        toast({
          title: "Success",
          description: "Template updated successfully",
        })
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || `Failed to ${mode} template`,
        variant: "destructive",
      })
    }
  }

  const handleVersionSelect = (version: Template) => {
    setEditedTemplate(prev => ({
      ...prev,
      html_content: version.html_content,
      change_summary: `Restored from version ${version.version}`
    }))
  }

  if (!template && mode === 'edit') return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex justify-between items-center">
              <DialogTitle>{mode === 'create' ? 'Create Template' : 'Edit Template'}</DialogTitle>
              <div className="flex items-center gap-2">
                {mode === 'edit' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsHistoryOpen(true)}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Version History
                  </Button>
                )}
                <Button onClick={handleSave} disabled={updateTemplate.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Create' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={editedTemplate.name}
                  onChange={(e) => setEditedTemplate(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={editedTemplate.description}
                  onChange={(e) => setEditedTemplate(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                />
              </div>
            </div>

            {requiredVariables.length > 0 && (
              <div className="space-y-2 mt-2">
                <Label>Template Variables</Label>
                <div className="flex flex-wrap gap-2 pb-2">
                  {requiredVariables.map(variable => (
                    <Badge key={variable} variant="secondary">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Tabs defaultValue="editor" className="flex-1">
              <TabsList className="grid w-full grid-cols-2 mt-4">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="flex-1 mt-0">
                <TemplateEditor
                  value={editedTemplate.html_content}
                  onChange={(value) => setEditedTemplate(prev => ({
                    ...prev,
                    html_content: value
                  }))}
                  onSave={handleSave}
                  autoSave={false}
                />
              </TabsContent>
              <TabsContent value="preview" className="flex-1 mt-0">
                <TemplatePreview
                  html={editedTemplate.html_content}
                  variables={requiredVariables}
                />
              </TabsContent>
            </Tabs>

            <div className="space-y-2 py-4">
              <Label htmlFor="change-summary">Change Summary</Label>
              <Input
                id="change-summary"
                placeholder="Briefly describe your changes"
                value={editedTemplate.change_summary}
                onChange={(e) => setEditedTemplate(prev => ({
                  ...prev,
                  change_summary: e.target.value
                }))}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {mode === 'edit' && template && (
        <VersionHistory
          templateId={template.id}
          open={isHistoryOpen}
          onOpenChange={setIsHistoryOpen}
          onVersionSelect={handleVersionSelect}
        />
      )}
    </>
  )
}
