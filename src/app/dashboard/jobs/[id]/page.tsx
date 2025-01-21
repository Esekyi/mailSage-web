'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { JobStatusBadge } from '@/components/jobs/job-status-badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useJobStatus, useJobAnalytics } from '@/hooks/useJobs'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from 'next-themes'
import { Badge } from '@/components/ui/badge'

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-6 w-24 bg-muted rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-muted rounded animate-pulse" />
    </div>
  )
}

export default function JobDetailsPage() {
  const params = useParams()
  const jobId = parseInt(params.id as string)
  const { data: job, isLoading: isJobLoading } = useJobStatus(jobId)
  const { data: analytics, isLoading: isAnalyticsLoading } = useJobAnalytics(jobId)
  const [showRetryDialog, setShowRetryDialog] = useState(false)
  const { theme } = useTheme()

  const isLoading = isJobLoading || isAnalyticsLoading

  if (isLoading) {
    return <LoadingState />
  }

  if (!job || !analytics) {
    return <div>Job not found</div>
  }

  const statusData = Object.entries(analytics.delivery_stats.by_status).map(([status, data]) => ({
    name: status,
    value: data.count,
    attempts: data.avg_attempts,
    percentage: data.percentage
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job #{jobId}</h1>
          <div className="space-y-1">
            <p className="text-muted-foreground">
              Created {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
            </p>
            {job.meta_data && (
              <div className="flex gap-2 text-sm text-muted-foreground">
                {job.meta_data.is_templated && <Badge variant="outline">Templated</Badge>}
                <Badge variant="outline">SMTP: {job.meta_data.smtp_strategy}</Badge>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <JobStatusBadge status={job.status} />
          {job.status === 'failed' && (
            <Button variant="outline" onClick={() => setShowRetryDialog(true)}>
              Retry Job
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Current job progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={job.progress?.percentage ?? 0} />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Sent</p>
                  <p className="font-medium">{job.progress?.sent ?? 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Failed</p>
                  <p className="font-medium">{job.progress?.failed ?? 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pending</p>
                  <p className="font-medium">{job.progress?.pending ?? 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium">{job.progress?.total ?? 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
            <CardDescription>Delivery success rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {(analytics.delivery_stats?.success_rate ?? 0).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Failure Rate: {(analytics.performance_metrics?.failure_rate ?? 0).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Time</CardTitle>
            <CardDescription>Job timing metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold">
                  {analytics.job_info?.processing_time
                    ? `${(analytics.job_info.processing_time / 60).toFixed(1)}m`
                    : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Total Processing Time</div>
              </div>
              <div className="text-sm grid gap-2">
                <div>
                  <span className="text-muted-foreground">Avg. Delivery Time: </span>
                  {analytics.performance_metrics?.average_delivery_time
                    ? `${analytics.performance_metrics.average_delivery_time.toFixed(2)}s`
                    : 'N/A'}
                </div>
                <div>
                  <span className="text-muted-foreground">Delivery Rate: </span>
                  {(analytics.performance_metrics?.delivery_rate ?? 0).toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Status</CardTitle>
            <CardDescription>Breakdown of email delivery status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded p-2 shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm">Count: {data.value}</p>
                            <p className="text-sm">Percentage: {data.percentage.toFixed(1)}%</p>
                            <p className="text-sm">Avg. Attempts: {data.attempts.toFixed(1)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill={theme === 'dark' ? 'hsl(var(--primary))' : 'hsl(var(--primary))'}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Job execution timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 pl-4 space-y-4">
                <div className="relative">
                  <div className="absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">Created</p>
                    <time className="text-sm text-muted-foreground">
                      {new Date(job.created_at).toLocaleString()}
                    </time>
                  </div>
                </div>
                {job.started_at && (
                  <div className="relative">
                    <div className="absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">Started</p>
                      <time className="text-sm text-muted-foreground">
                        {new Date(job.started_at).toLocaleString()}
                      </time>
                    </div>
                  </div>
                )}
                {job.meta_data?.paused_at && (
                  <div className="relative">
                    <div className="absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full bg-yellow-500" />
                    <div>
                      <p className="font-medium">Paused</p>
                      <time className="text-sm text-muted-foreground">
                        {new Date(job.meta_data.paused_at).toLocaleString()}
                      </time>
                      <p className="text-sm text-muted-foreground">
                        Reason: {job.meta_data.pause_reason}
                      </p>
                    </div>
                  </div>
                )}
                {job.meta_data?.resumed_at && (
                  <div className="relative">
                    <div className="absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full bg-green-500" />
                    <div>
                      <p className="font-medium">Resumed</p>
                      <time className="text-sm text-muted-foreground">
                        {new Date(job.meta_data.resumed_at).toLocaleString()}
                      </time>
                    </div>
                  </div>
                )}
                {job.completed_at && (
                  <div className="relative">
                    <div className="absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">Completed</p>
                      <time className="text-sm text-muted-foreground">
                        {new Date(job.completed_at).toLocaleString()}
                      </time>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {analytics.error_analysis.patterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Error Analysis</CardTitle>
            <CardDescription>Common error patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.error_analysis.patterns.map((pattern, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{pattern.error}</p>
                    <p className="text-sm text-muted-foreground">
                      {pattern.count} occurrences ({pattern.percentage.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={showRetryDialog} onOpenChange={setShowRetryDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retry Failed Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to retry this job? This will attempt to resend all failed emails.
              {job.error_details && (
                <div className="mt-2 p-2 bg-destructive/10 rounded text-sm">
                  <strong>Error:</strong> {job.error_details}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Retry Job</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
