'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useTemplates } from '@/hooks/useTemplates'
import { Template, CompareVersionsResponse, TemplateDifference } from '@/types/templates'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Loader2, RotateCcw, ArrowRightLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { AxiosError } from 'axios'

interface ApiErrorResponse {
  error: string
}

interface VersionHistoryProps {
  templateId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onVersionSelect: (version: Template) => void
}

export function VersionHistory({
  templateId,
  open,
  onOpenChange,
}: VersionHistoryProps) {
  const [selectedVersions, setSelectedVersions] = useState<number[]>([])
  const { revertToVersion } = useTemplates()
  const toast = useToast()

  // Fetch version history with error handling
  const { data: versions, isLoading, error: versionsError } = useQuery({
    queryKey: ['template-versions', templateId],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get<{ versions: Template[] }>(
          `/api/v1/templates/${templateId}/versions`
        )
        return data.versions
      } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>
        throw new Error(axiosError.response?.data?.error || 'Failed to fetch versions')
      }
    },
    enabled: open
  })

  // Fetch version comparison with error handling
  const { data: comparison, error: comparisonError } = useQuery<CompareVersionsResponse & { differences: TemplateDifference[] }>({
    queryKey: ['template-comparison', templateId, ...selectedVersions],
    queryFn: async () => {
      try {
        const [version1, version2] = selectedVersions
        const { data } = await axiosInstance.get<CompareVersionsResponse>(
          `/api/v1/templates/${templateId}/versions/compare`,
          { params: { version1, version2 } }
        )

        // Compute differences manually
        const differences: TemplateDifference[] = []

        // Compare html_content
        if (data.version1.html_content !== data.version2.html_content) {
          differences.push({
            field: 'HTML Content',
            old_value: data.version1.html_content || '',
            new_value: data.version2.html_content || ''
          })
        }

        // Compare meta_data fields
        const metaFields = {
          name: 'Name',
          description: 'Description',
          archived_at: 'Archived At',
          change_summary: 'Change Summary'
        } as const

        Object.entries(metaFields).forEach(([key, label]) => {
          const oldValue = data.version1.meta_data[key as keyof typeof metaFields]
          const newValue = data.version2.meta_data[key as keyof typeof metaFields]

          if (oldValue !== newValue) {
            differences.push({
              field: label,
              old_value: oldValue || 'None',
              new_value: newValue || 'None'
            })
          }
        })

        return {
          ...data,
          differences
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>
        throw new Error(axiosError.response?.data?.error || 'Failed to compare versions')
      }
    },
    enabled: selectedVersions.length === 2
  })

  const handleVersionClick = (version: number) => {
    if (selectedVersions.includes(version)) {
      setSelectedVersions(prev => prev.filter(v => v !== version))
    } else if (selectedVersions.length < 2) {
      setSelectedVersions(prev => [...prev, version])
    }
  }

  const handleRevertClick = async (version: Template) => {
    try {
      await revertToVersion.mutateAsync({
        templateId,
        version: version.version
      })
      toast.success({
        description: `Reverted to version ${version.version}`
      })
      onOpenChange(false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      const errorMessage = axiosError.response?.data?.error || axiosError.message || "Failed to revert version"
      toast.error({
        title: "Error",
        description: errorMessage
      })
    }
  }

  // Format the difference value for display
  const formatDiffValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'None'
    if (typeof value === 'string') return value
    return JSON.stringify(value)
  }

  // Determine if there are actual differences
  const hasDifferences = comparison?.differences && comparison.differences.length > 0

  // Show error states in UI
  if (versionsError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-40 text-destructive">
            {versionsError instanceof Error ? versionsError.message : 'Failed to load versions'}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Version History</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {versions?.map((version) => (
                  <div
                    key={version.version}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Version {version.version}</h4>
                        {version.meta_data.initial_version && (
                          <Badge variant="secondary">Initial Version</Badge>
                        )}
                        <Badge variant="outline">
                          {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {version.meta_data.change_summary || 'No change summary provided'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVersionClick(version.version)}
                        className={selectedVersions.includes(version.version) ? 'bg-primary text-primary-foreground' : ''}
                      >
                        {selectedVersions.includes(version.version) ? 'Selected' : 'Compare'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevertClick(version)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restore
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {selectedVersions.length === 2 && comparison && (
            <div className="border-t mt-4 flex-shrink-0">
              <div className="pt-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  Version Comparison
                </h4>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-6">
                    {/* HTML Content Preview */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">HTML Content Preview</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Version {comparison.version1.version}</div>
                          <div className="p-4 rounded border bg-muted/50 prose-sm max-w-none dark:prose-invert"
                               dangerouslySetInnerHTML={{ __html: comparison.version1.html_content }}
                          />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Version {comparison.version2.version}</div>
                          <div className="p-4 rounded border bg-muted/50 prose-sm max-w-none dark:prose-invert"
                               dangerouslySetInnerHTML={{ __html: comparison.version2.html_content }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Raw HTML Comparison */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Raw HTML</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-2 bg-destructive/10 rounded">
                          <pre className="text-xs whitespace-pre-wrap break-words">
                            {comparison.version1.html_content}
                          </pre>
                        </div>
                        <div className="p-2 bg-success/10 rounded">
                          <pre className="text-xs whitespace-pre-wrap break-words">
                            {comparison.version2.html_content}
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* Other Differences */}
                    {hasDifferences && (
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Other Changes</h5>
                        <div className="space-y-4">
                          {comparison.differences?.map((diff: TemplateDifference, i: number) => (
                            diff.field !== 'HTML Content' && (
                              <div key={`${diff.field}-${i}`} className="text-sm">
                                <span className="font-medium">{diff.field}:</span>
                                <div className="grid grid-cols-2 gap-4 mt-1">
                                  <div className="p-2 bg-destructive/10 rounded">
                                    <pre className="whitespace-pre-wrap break-words">
                                      {formatDiffValue(diff.old_value)}
                                    </pre>
                                  </div>
                                  <div className="p-2 bg-success/10 rounded">
                                    <pre className="whitespace-pre-wrap break-words">
                                      {formatDiffValue(diff.new_value)}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Add error message for comparison */}
          {comparisonError && selectedVersions.length === 2 && (
            <div className="border-t mt-4 p-4 text-destructive text-sm">
              {comparisonError instanceof Error ? comparisonError.message : 'Failed to compare versions'}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
