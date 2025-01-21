'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { JobsTable } from '@/components/jobs/jobs-table'
import { useActiveJobs } from '@/hooks/useJobs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-[250px] bg-muted rounded animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-[200px] bg-muted rounded animate-pulse" />
        <div className="h-4 w-[300px] bg-muted rounded animate-pulse" />
      </div>
      <div className="h-[400px] bg-muted rounded animate-pulse" />
    </div>
  )
}

function ErrorState({ error }: { error: Error }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message}
      </AlertDescription>
    </Alert>
  )
}

export default function JobsOverviewPage() {
  const { data, isLoading, error, refetch } = useActiveJobs()

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error as Error} />
  }

  const activeJobs = data?.active_jobs || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Active Jobs</h2>
        <p className="text-muted-foreground">
          Monitor and manage your currently running email jobs.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Jobs Overview</CardTitle>
          <CardDescription>
            View and manage jobs that are currently processing or paused.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobsTable
            jobs={activeJobs}
            pageCount={1}
            currentPage={1}
            perPage={activeJobs.length}
            totalItems={activeJobs.length}
            onPaginationChange={() => {}} // No pagination for active jobs
            onRefresh={refetch}
          />
        </CardContent>
      </Card>
    </div>
  )
}
