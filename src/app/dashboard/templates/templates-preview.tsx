'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, RefreshCw, History } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { Badge } from '@/components/ui/badge'
import { Template } from '@/types/templates'

interface PreviewProps {
  html: string
  variables: string[]
  template?: Template
  onVersionHistoryClick?: () => void
}

export function TemplatePreview({
  html,
  variables,
  template,
  onVersionHistoryClick
}: PreviewProps) {
  const [showPreview, setShowPreview] = useState(true)
  const [testData, setTestData] = useState<Record<string, string>>({})

  // Initialize test data for each variable
  useEffect(() => {
    const initialData = variables.reduce((acc, variable) => ({
      ...acc,
      [variable]: `Test ${variable}`
    }), {})
    setTestData(initialData)
  }, [variables])

  const { data: preview, isLoading } = useQuery({
    queryKey: ['template-preview', html, testData],
    queryFn: async () => {
      const { data } = await axiosInstance.post('/api/v1/templates/preview', {
        html_content: html,
        variables: testData
      })
      return data.preview_html
    },
    enabled: showPreview && html.length > 0
  })

  const handleVariableChange = (variable: string, value: string) => {
    setTestData(prev => ({
      ...prev,
      [variable]: value
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium">Template Preview</h3>
          {template && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Version {template.version_info.current_version}
              </Badge>
              {template.version_info.has_versions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onVersionHistoryClick}
                >
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Preview
              </>
            )}
          </Button>
        </div>
      </div>

      {variables.length > 0 && (
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-3">Test Variables</h4>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {variables.map(variable => (
              <div key={variable} className="space-y-2">
                <Label htmlFor={variable}>{variable}</Label>
                <Input
                  id={variable}
                  value={testData[variable] || ''}
                  onChange={(e) => handleVariableChange(variable, e.target.value)}
                  placeholder={`Value for ${variable}`}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {showPreview && (
        <Card className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div
              className="prose max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: preview || html }}
            />
          )}
        </Card>
      )}
    </div>
  )
}
