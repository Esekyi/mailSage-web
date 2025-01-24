'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { JobsTable } from '@/components/jobs/jobs-table'
import { useJobs } from '@/hooks/useJobs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, X, AlertCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import type { JobStatus } from '@/types/jobs'
import type { DateRange } from 'react-day-picker'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const statusFilters: JobStatus[] = ['processing', 'completed', 'failed', 'paused', 'stopped', 'pending']

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

export default function JobHistoryPage() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [selectedStatuses, setSelectedStatuses] = useState<JobStatus[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [search, setSearch] = useState('')
  const [formattedDateRange, setFormattedDateRange] = useState<string>('')

  useEffect(() => {
    if (dateRange?.from) {
      if (dateRange.to) {
        setFormattedDateRange(`${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`)
      } else {
        setFormattedDateRange(format(dateRange.from, "LLL dd, y"))
      }
    } else {
      setFormattedDateRange("Pick dates")
    }
  }, [dateRange])

  const { fetchJobs } = useJobs()
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['jobs', { page, perPage, status: selectedStatuses, dateRange, search }],
    queryFn: () => fetchJobs({
      page,
      per_page: perPage,
      status: selectedStatuses,
      start_date: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
      end_date: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    }),
  })

  const handleStatusToggle = (status: JobStatus) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const clearFilters = () => {
    setSelectedStatuses([])
    setDateRange(undefined)
    setSearch('')
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error as Error} />
  }

  const hasActiveFilters = selectedStatuses.length > 0 || dateRange || search

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Job History</h2>
        <p className="text-muted-foreground">
          View and manage all your email jobs.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  dateRange && "text-primary"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formattedDateRange}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((status) => (
            <Badge
              key={status}
              variant={selectedStatuses.includes(status) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleStatusToggle(status)}
            >
              {status}
            </Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job History</CardTitle>
          <CardDescription>
            View and manage all your email jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data && (
            <JobsTable
              jobs={data.jobs}
              pageCount={data.pagination.pages}
              currentPage={page}
              perPage={perPage}
              totalItems={data.pagination.total}
              onPaginationChange={({ page: newPage, per_page: newPerPage }) => {
                setPage(newPage)
                setPerPage(newPerPage)
              }}
              onRefresh={refetch}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
