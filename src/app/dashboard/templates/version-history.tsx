'use client'

import { useQuery } from '@tanstack/react-query'
import { Template } from '@/types/template'
import { axiosInstance } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { History, ArrowLeft, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { DiffEditor } from '@monaco-editor/react'

interface VersionHistoryProps {
  templateId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onVersionSelect?: (version: Template) => void
}

export function VersionHistory({
  templateId,
  open,
  onOpenChange,
  onVersionSelect
}: VersionHistoryProps) {
  const { data: versions, isLoading } = useQuery({
    queryKey: ['template-versions', templateId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/v1/templates/${templateId}/versions`
      )
      return data.versions as Template[]
    },
    enabled: open
  })

  const [selectedVersion, setSelectedVersion] = useState<Template | null>(null)
  const [compareVersion, setCompareVersion] = useState<Template | null>(null)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
        <SheetHeader>
          <SheetTitle>Version History</SheetTitle>
          <SheetDescription>
            View and compare different versions of this template
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-8rem)] overflow-hidden">
          <div className="overflow-y-auto pr-2 border-r md:col-span-1">
            {versions?.map((version) => (
              <Card
                key={version.version}
                className={`p-4 mb-2 cursor-pointer transition-colors ${
                  selectedVersion?.version === version.version
                    ? 'bg-accent'
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => setSelectedVersion(version)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">v{version.version}</span>
                  {version.version_info.is_latest && (
                    <Badge>Latest</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(version.created_at), {
                    addSuffix: true
                  })}
                </div>
                {version.version_info.change_summary && (
                  <p className="text-sm mt-2">
                    {version.version_info.change_summary}
                  </p>
                )}
              </Card>
            ))}
          </div>

          <div className="overflow-y-auto md:col-span-2">
            {selectedVersion && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedVersion && onVersionSelect) {
                          onVersionSelect(selectedVersion)
                          onOpenChange(false)
                        }
                      }}
                    >
                      Restore this version
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!compareVersion}
                      onClick={() => setCompareVersion(null)}
                    >
                      Clear Diff
                    </Button>
                  </div>
                </div>

                {compareVersion ? (
                  <DiffEditor
                    height="500px"
                    language="html"
                    original={compareVersion.html_content}
                    modified={selectedVersion.html_content}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                    }}
                  />
                ) : (
                  <pre className="p-4 bg-accent rounded-md overflow-auto">
                    {selectedVersion.html_content}
                  </pre>
                )}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
