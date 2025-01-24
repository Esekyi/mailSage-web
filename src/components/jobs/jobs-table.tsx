'use client'

import { useState, useEffect } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { type Job } from '@/types/jobs'
import { JobStatusBadge } from '@/components/jobs/job-status-badge'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { JobControls } from '@/components/jobs/job-controls'
import { BulkJobControls } from '@/components/jobs/job-controls'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

interface JobProgress {
  percentage: number
  sent: number
  total: number
  failed?: number
  pending?: number
}

function ClientDate({ date }: { date: string }) {
  const [formattedDate, setFormattedDate] = useState<string>('')

  useEffect(() => {
    setFormattedDate(formatDistanceToNow(new Date(date), { addSuffix: true }))
  }, [date])

  return formattedDate
}

function ClientProgress({ progress }: { progress: JobProgress }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="w-full space-y-1">
      <Progress value={progress.percentage} className="h-2" />
      <div className="text-xs text-muted-foreground">
        {progress.sent} / {progress.total} sent ({progress.percentage}%)
        {progress.failed ? ` • ${progress.failed} failed` : ''}
        {progress.pending ? ` • ${progress.pending} pending` : ''}
      </div>
    </div>
  )
}

interface JobsTableProps {
  jobs: Job[]
  pageCount: number
  currentPage: number
  perPage: number
  totalItems: number
  onPaginationChange: (values: { page: number; per_page: number }) => void
  onRefresh?: () => void
}

export function JobsTable({
  jobs,
  pageCount,
  currentPage,
  perPage,
  totalItems,
  onPaginationChange,
  onRefresh
}: JobsTableProps) {
  const [selectedJobs, setSelectedJobs] = useState<Job[]>([])
  const { data: jobStatuses } = useQuery({
    queryKey: ['job-statuses', jobs.map(job => job.id)],
    queryFn: async () => {
      const statuses = await Promise.all(
        jobs.map(job =>
          axiosInstance.get<Job>(`/api/v1/jobs/${job.id}/status`)
            .then(response => response.data)
            .catch(() => null)
        )
      )
      return statuses.filter((status): status is Job => status !== null)
    },
    refetchInterval: 5000, // Refresh every 5 seconds
    enabled: jobs.some(job => ['processing', 'pending'].includes(job.status))
  })

  const getJobProgress = (jobId: number): JobProgress => {
    const originalJob = jobs.find(job => job.id === jobId)
    const jobStatus = jobStatuses?.find(status => status.id === jobId)

    // If we have a status update, use it
    if (jobStatus?.progress) {
      return jobStatus.progress
    }

    // For completed jobs, ensure we show the actual progress
    if (originalJob?.status === 'completed' && originalJob.progress) {
      return {
        ...originalJob.progress,
        percentage: 100, // Ensure it shows as 100% complete
      }
    }

    // For failed jobs, show the actual failed count
    if (originalJob?.status === 'failed' && originalJob.progress) {
      return {
        ...originalJob.progress,
        failed: originalJob.progress.total - originalJob.progress.sent
      }
    }

    // For stopped jobs, show actual progress with failed count
    if (originalJob?.status === 'stopped' && originalJob.progress) {
      return {
        ...originalJob.progress,
        failed: originalJob.progress.total - originalJob.progress.sent
      }
    }

    // Fall back to the original job's progress or default values
    return originalJob?.progress || { percentage: 0, sent: 0, total: 0 }
  }

  const columns: ColumnDef<Job>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
            setSelectedJobs(value ? table.getRowModel().rows.map(row => row.original) : [])
          }}
          aria-label="Select all"
          className="data-[state=checked]:bg-primary"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedJobs.some(job => job.id === row.original.id)}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
            setSelectedJobs(prev => {
              if (value) {
                return prev.some(job => job.id === row.original.id)
                  ? prev
                  : [...prev, row.original]
              } else {
                return prev.filter(job => job.id !== row.original.id)
              }
            })
          }}
          aria-label="Select row"
          className="data-[state=checked]:bg-primary"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: 'Job ID',
      cell: ({ row }) => {
        const job = row.original
        return (
          <Link href={`/dashboard/jobs/${job.id}`} className="font-medium hover:underline">
            #{job.id}
          </Link>
        )
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <JobStatusBadge status={row.original.status} />
    },
    {
      accessorKey: 'progress',
      header: 'Progress',
      cell: ({ row }) => {
        const progress = getJobProgress(row.original.id)
        return <ClientProgress progress={progress} />
      }
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => <ClientDate date={row.original.created_at} />
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const job = row.original
        return (
          <div className="flex items-center justify-end gap-2">
            <JobControls
              job={job}
              onStatusChange={onRefresh}
              size="sm"
            />
            <Link
              href={`/dashboard/jobs/${job.id}`}
              className="text-sm text-muted-foreground hover:underline"
            >
              Details
            </Link>
          </div>
        )
      }
    }
  ]

  return (
    <div className="space-y-4">
      {selectedJobs.length > 0 && (
        <BulkJobControls
          selectedJobs={selectedJobs}
          onActionComplete={() => {
            setSelectedJobs([])
            onRefresh?.()
          }}
        />
      )}

      <DataTable
        columns={columns}
        data={jobs}
        pageCount={pageCount}
        currentPage={currentPage}
        perPage={perPage}
        totalItems={totalItems}
        onPaginationChange={onPaginationChange}
      />
    </div>
  )
}
