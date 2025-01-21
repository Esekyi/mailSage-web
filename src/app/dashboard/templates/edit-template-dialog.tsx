'use client'

import { useState, useEffect } from 'react'
import { Template, TemplateApiError } from '@/types/templates'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useTemplates } from '@/hooks/useTemplates'
import { useToast } from '@/hooks/use-toast'
import { TemplateEditor } from './template-editor'
import { TemplatePreview } from './templates-preview'
import { VersionHistory } from './version-history'
import { History, Save, Tag } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AxiosError } from 'axios'

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
    change_summary: '',
    tags: [] as string[]
  })

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [requiredVariables, setRequiredVariables] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  const { createTemplate, updateTemplate } = useTemplates()
  const toast = useToast()

  // Initialize form when template changes
  useEffect(() => {
    if (mode === 'create') {
      setEditedTemplate({
        name: '',
        description: '',
        html_content: '',
        change_summary: '',
        tags: []
      })
      setRequiredVariables([])
    } else if (template) {
      setEditedTemplate({
        name: template.name,
        description: template.description || '',
        html_content: template.html_content,
        change_summary: '',
        tags: template.tags || []
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
        tags: editedTemplate.tags,
        ...(mode === 'edit' && {
          change_summary: editedTemplate.change_summary || undefined
        })
      }

      if (mode === 'create') {
        await createTemplate.mutateAsync(templateData)
        toast.success({
          description: "Template created successfully"
        })
      } else {
        if (!template) return
        await updateTemplate.mutateAsync({
          id: template.id,
          payload: templateData
        })
        toast.success({
          description: `Template updated successfully (Version ${template.version_info.current_version + 1})`
        })
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      const apiError = error as AxiosError<TemplateApiError>

      // Handle limit errors (403)
      if (apiError.response?.status === 403 && 'current_usage' in apiError.response.data) {
        const limitError = apiError.response.data
        toast.error({
          title: "Plan Limit Reached",
          description: limitError.error || "Failed to save template"
        })
        return
      }

      // Handle validation errors (400)
      if (apiError.response?.status === 400) {
        toast.error({
          title: "Validation Error",
          description: apiError.response.data.error
        })
        return
      }

      // Handle other errors
      toast.error({
        title: "Error",
        description: apiError.response?.data?.error || "Failed to save template"
      })
    }
  }

  const handleVersionSelect = (version: Template) => {
    setEditedTemplate(prev => ({
      ...prev,
      html_content: version.html_content,
      change_summary: `Restored from version ${version.version}`
    }))
    setIsHistoryOpen(false)
  }

  const addTag = () => {
    if (newTag && !editedTemplate.tags.includes(newTag)) {
      setEditedTemplate(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditedTemplate(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  if (!template && mode === 'edit') return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <DialogTitle>
                  {mode === 'create' ? 'Create Template' : 'Edit Template'}
                </DialogTitle>
                {mode === 'edit' && template && (
                  <Badge variant="secondary">
                    Version {template.version_info.current_version}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {mode === 'edit' && template?.version_info.has_versions && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsHistoryOpen(true)}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Version History
                  </Button>
                )}
                <Button onClick={handleSave} disabled={createTemplate.isPending || updateTemplate.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Create' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="space-y-6 p-6">
              <div className="space-y-4">
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
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editedTemplate.tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTag}
                    >
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {requiredVariables.length > 0 && (
                <div className="space-y-2">
                  <Label>Template Variables</Label>
                  <div className="flex flex-wrap gap-2">
                    {requiredVariables.map(variable => (
                      <Badge key={variable} variant="outline">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Tabs defaultValue="editor" className="flex-1">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="editor" className="mt-0">
                  <div className="border rounded-md">
                    <TemplateEditor
                      value={editedTemplate.html_content}
                      onChange={(value) => setEditedTemplate(prev => ({
                        ...prev,
                        html_content: value
                      }))}
                      onSave={handleSave}
                      autoSave={false}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="preview" className="mt-0">
                  <TemplatePreview
                    html={editedTemplate.html_content}
                    variables={requiredVariables}
                  />
                </TabsContent>
              </Tabs>

              {mode === 'edit' && (
                <div className="space-y-2">
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
              )}
            </div>
          </ScrollArea>
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
