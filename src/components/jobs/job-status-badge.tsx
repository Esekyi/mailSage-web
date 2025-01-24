import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { JobStatus } from "@/types/jobs"

interface JobStatusBadgeProps {
  status: JobStatus
  className?: string
}

export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  const getStatusVariant = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/15 text-green-700 dark:bg-green-500/25 dark:text-green-300 hover:bg-green-500/25'
      case 'failed':
        return 'bg-red-500/15 text-red-700 dark:bg-red-500/25 dark:text-red-300 hover:bg-red-500/25'
      case 'processing':
        return 'bg-blue-500/15 text-blue-700 dark:bg-blue-500/25 dark:text-blue-300 hover:bg-blue-500/25'
      case 'paused':
        return 'bg-yellow-500/15 text-yellow-700 dark:bg-yellow-500/25 dark:text-yellow-300 hover:bg-yellow-500/25'
      case 'stopped':
        return 'bg-gray-500/15 text-gray-700 dark:bg-gray-500/25 dark:text-gray-300 hover:bg-gray-500/25'
      case 'pending':
        return 'bg-purple-500/15 text-purple-700 dark:bg-purple-500/25 dark:text-purple-300 hover:bg-purple-500/25'
      default:
        return 'bg-gray-500/15 text-gray-700 dark:bg-gray-500/25 dark:text-gray-300 hover:bg-gray-500/25'
    }
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        "capitalize font-medium",
        getStatusVariant(),
        className
      )}
    >
      {status}
    </Badge>
  )
}
