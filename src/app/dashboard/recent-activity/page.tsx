'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRecentActivity } from '@/hooks/useDashboard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function getActivityIcon(type: string) {
  switch (type) {
    case 'email_job':
      return '📧'
    case 'template':
      return '📄'
    case 'smtp':
      return '🔧'
    case 'api_key':
      return '🔑'
    default:
      return '📝'
  }
}

function getStatusBadgeVariant(status: string | undefined) {
  if (!status) return 'secondary'
  switch (status.toLowerCase()) {
    case 'success':
      return 'success'
    case 'failed':
      return 'destructive'
    case 'pending':
      return 'warning'
    default:
      return 'secondary'
  }
}

export function RecentActivity() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const { data: activities, isLoading } = useRecentActivity({
    page,
    per_page: perPage
  })

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value))
    setPage(1) // Reset to first page when changing items per page
  }

  const renderPaginationButtons = () => {
    if (!activities?.total_pages) return null

    const totalPages = activities.total_pages
    let startPage = Math.max(1, page - 2)
    let endPage = Math.min(totalPages, page + 2)

    // Adjust the range if we're near the start or end
    if (page <= 3) {
      endPage = Math.min(5, totalPages)
    }
    if (page >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4)
    }

    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={`page-${i}`}
          variant={page === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="w-8"
        >
          {i}
        </Button>
      )
    }

    return pages
  }

  if (isLoading) {
    return <RecentActivitySkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={perPage.toString()}
              onValueChange={handlePerPageChange}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="10 per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities?.items.map((activity) => (
              <TableRow key={`activity-${page}-${activity.id}-${activity.created_at}`}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{getActivityIcon(activity.type)}</span>
                    <span className="capitalize">{activity.type.replace('_', ' ')}</span>
                  </div>
                </TableCell>
                <TableCell>{activity.description}</TableCell>
                <TableCell>
                  {activity.status && (
                    <Badge variant={getStatusBadgeVariant(activity.status)}>
                      {activity.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
            {(!activities?.items.length) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No recent activity
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            {activities?.total ? (
              <>
                Showing {((page - 1) * perPage) + 1} to{' '}
                {Math.min(page * perPage, activities.total)} of{' '}
                {activities.total} entries
              </>
            ) : (
              'No entries to show'
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || !activities?.total}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {renderPaginationButtons()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={!activities?.total || page === activities?.total_pages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(null).map((_, i) => (
              <TableRow key={`skeleton-row-${i}`}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
