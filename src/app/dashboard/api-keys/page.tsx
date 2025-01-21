"use client"

import { useState, useEffect } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { type CreateAPIKeyRequest } from "@/types/api-keys"
import { useApiKeys } from "@/hooks/useApiKeys"
import { ApiKeyMetrics } from "@/components/api-keys/api-key-metrics"
import { ApiKeyDisplay } from "@/components/api-keys/api-key-display"
import { CreateApiKeyDialog } from "@/components/api-keys/create-api-key-dialog"
import { useToast } from "@/hooks/use-toast"

export default function ApiKeysPage() {
  const { apiKeys, createApiKey, deleteApiKey, useApiKeyUsage } = useApiKeys()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedMetricsKeyId, setSelectedMetricsKeyId] = useState<number>()
  const [selectedDays, setSelectedDays] = useState(30)
  const { success } = useToast()

  const { data: usage, isLoading: isLoadingUsage } = useApiKeyUsage(selectedMetricsKeyId ?? 0, selectedDays)

  useEffect(() => {
    if (apiKeys?.length && !selectedMetricsKeyId) {
      setSelectedMetricsKeyId(apiKeys[0].id)
    }
  }, [apiKeys, selectedMetricsKeyId])

  const handleCreateKey = async (data: CreateAPIKeyRequest) => {
    try {
      const result = await createApiKey.mutateAsync(data)
      success({
        title: "API key created successfully",
        description: "Make sure to copy your key now as it won't be shown again.",
      })
      setShowCreateDialog(false)
      return { key: result.key }
    } catch (_err) {
      // Error will be handled by the mutation
      throw _err
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="API Keys"
        description="Create and manage API keys for accessing the MailSage API."
      >
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </PageHeader>

      {apiKeys?.length > 0 && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <div className="mb-6">
              <Select
                value={selectedMetricsKeyId?.toString()}
                onValueChange={(value) => setSelectedMetricsKeyId(Number(value))}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select an API key" />
                </SelectTrigger>
                <SelectContent>
                  {apiKeys.map((key) => (
                    <SelectItem key={key.id} value={key.id.toString()}>
                      {key.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isLoadingUsage ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : usage ? (
              <ApiKeyMetrics
                usage={usage.usage_stats}
                onDaysChange={setSelectedDays}
              />
            ) : null}
          </div>
        </div>
      )}

      {apiKeys?.length ? (
        <div className="grid gap-6">
          {apiKeys.map((key) => (
            <ApiKeyDisplay
              key={key.id}
              apiKey={key}
              onRevoke={() => deleteApiKey.mutateAsync(key.id)}
              dailyUsage={usage?.usage_stats.current_daily_requests}
              dailyLimit={usage?.usage_stats.daily_limit}
            />
          ))}
        </div>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="key" />
          <EmptyPlaceholder.Title>No API keys created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any API keys yet. Create one to get started.
          </EmptyPlaceholder.Description>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create API Key
          </Button>
        </EmptyPlaceholder>
      )}

      <CreateApiKeyDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateKey}
        isSubmitting={createApiKey.isPending}
      />
    </div>
  )
}

