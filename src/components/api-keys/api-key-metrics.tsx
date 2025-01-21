import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type ApiKeyUsageStats } from "@/types/api-keys"
import { formatNumber } from "@/lib/utils"

interface ApiKeyMetricsProps {
  usage: ApiKeyUsageStats
  onDaysChange: (days: number) => void
}

export function ApiKeyMetrics({ usage, onDaysChange }: ApiKeyMetricsProps) {
  // Get the top endpoint by sorting the endpoint_usage entries
  const topEndpoint = Object.entries(usage.endpoint_usage || {})
    .sort(([, a], [, b]) => b - a)[0]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select onValueChange={(value) => onDaysChange(Number(value))} defaultValue="30">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="60">Last 60 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(usage.total_requests)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(usage.current_daily_requests)} requests today
            </p>
            <p className="text-xs text-muted-foreground">
              {formatNumber(usage.daily_average)} daily average
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage.success_rate}%</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(usage.success_requests)} successful requests
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(usage.error_requests)}</div>
            <p className="text-xs text-muted-foreground">
              Last used {usage.last_used_at ? new Date(usage.last_used_at).toLocaleDateString() : 'Never'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Endpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium truncate">{topEndpoint ? topEndpoint[0] : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              {topEndpoint ? `${formatNumber(topEndpoint[1])} requests` : 'No requests'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
