'use client'

import { useState, useEffect, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileText, Code, FileJson } from 'lucide-react'
import { marked } from 'marked'
import debounce from 'lodash/debounce'

interface TemplateEditorProps {
  value: string
  onChange: (value: string) => void
  onSave?: () => void
  autoSave?: boolean
}

export function TemplateEditor({
  value,
  onChange,
  onSave,
  autoSave = false
}: TemplateEditorProps) {
  const [editorMode, setEditorMode] = useState<'html' | 'markdown'>('html')
  const [preview, setPreview] = useState('')

  // Autosave functionality - initially to false, but can be enabled by props
  const debouncedSave = useCallback(
    debounce((newValue: string) => {
      // Only autosave if explicitly enabled
      if (autoSave) {
        onSave?.()
      }
    }, 1000),
    [onSave, autoSave]
  )

  // Convert markdown to HTML when in markdown mode
  useEffect(() => {
    if (editorMode === 'markdown') {
      try {
        const html = marked(value)
        setPreview(html)
      } catch (error) {
        console.error('Error converting markdown:', error)
      }
    }
  }, [value, editorMode])


  useEffect(() => {
    if (value) {
      debouncedSave(value)
    }
    return () => {
      debouncedSave.cancel()
    }
  }, [value, debouncedSave])

  const handleEditorChange = (newValue: string = '') => {
    onChange(newValue)
  }

  return (
    <Card className="p-4 mt-4">
      <Tabs defaultValue="edit" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditorMode(mode =>
                mode === 'html' ? 'markdown' : 'html'
              )}
            >
              {editorMode === 'html' ? (
                <>
                  <Code className="h-4 w-4 mr-2" />
                  HTML
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Markdown
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSave?.()}
            >
              <FileJson className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <TabsContent value="edit" className="m-0">
          <Editor
            height="500px"
            language={editorMode === 'html' ? 'html' : 'markdown'}
            value={value}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              wordWrap: 'on',
              lineNumbers: 'on',
              formatOnPaste: true,
              automaticLayout: true,
            }}
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div
            className="prose max-w-none dark:prose-invert p-4 min-h-[500px] border rounded-md"
            dangerouslySetInnerHTML={{
              __html: editorMode === 'markdown' ? preview : value
            }}
          />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
