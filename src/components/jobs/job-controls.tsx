import { useState } from 'react'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useJobs } from '@/hooks/useJobs'
import type { Job } from '@/types/jobs'

interface JobControlsProps {
  job: Job
  onStatusChange?: () => void
  size?: 'default' | 'sm'
  maxRetries?: number
}

export function JobControls({ job, onStatusChange, size = 'default', maxRetries }: JobControlsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { controlJob } = useJobs()

  const handleAction = async (action: 'pause' | 'resume' | 'stop' | 'retry') => {
    setIsLoading(true)
    try {
      await controlJob({
        jobId: job.id,
        action,
        ...(action === 'retry' ? { maxRetries } : {})
      })
      onStatusChange?.()
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {job.status === 'processing' && (
        <Button
          variant="outline"
          size={size}
          onClick={() => handleAction('pause')}
          disabled={isLoading}
        >
          <Pause className="h-4 w-4 mr-2" />
          Pause
        </Button>
      )}

      {job.status === 'paused' && (
        <Button
          variant="outline"
          size={size}
          onClick={() => handleAction('resume')}
          disabled={isLoading}
        >
          <Play className="h-4 w-4 mr-2" />
          Resume
        </Button>
      )}

      {['processing', 'paused'].includes(job.status) && (
        <Button
          variant="outline"
          size={size}
          onClick={() => handleAction('stop')}
          disabled={isLoading}
        >
          <Square className="h-4 w-4 mr-2" />
          Stop
        </Button>
      )}

      {['completed', 'failed', 'stopped'].includes(job.status) && (
        <Button
          variant="outline"
          size={size}
          onClick={() => handleAction('retry')}
          disabled={isLoading}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      )}
    </div>
  )
}

interface BulkJobControlsProps {
  selectedJobs: Job[]
  onActionComplete?: () => void
  maxRetries?: number
}

export function BulkJobControls({ selectedJobs, onActionComplete, maxRetries }: BulkJobControlsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { bulkControl } = useJobs()

  const handleBulkAction = async (action: 'pause' | 'resume' | 'stop' | 'retry') => {
    setIsLoading(true)
    try {
      await bulkControl({
        job_ids: selectedJobs.map(job => job.id),
        action,
        ...(action === 'retry' ? { maxRetries } : {})
      })
      onActionComplete?.()
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsLoading(false)
    }
  }

  // Group jobs by status to determine available actions
  const jobsByStatus = selectedJobs.reduce<Record<string, number>>((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
      <p className="text-sm font-medium">
        {selectedJobs.length} job{selectedJobs.length !== 1 ? 's' : ''} selected
      </p>
      <div className="flex flex-wrap gap-2">
        {jobsByStatus['processing'] > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('pause')}
            disabled={isLoading}
          >
            <Pause className="h-4 w-4 mr-2" />
            Pause All ({jobsByStatus['processing']})
          </Button>
        )}

        {jobsByStatus['paused'] > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('resume')}
            disabled={isLoading}
          >
            <Play className="h-4 w-4 mr-2" />
            Resume All ({jobsByStatus['paused']})
          </Button>
        )}

        {(jobsByStatus['processing'] > 0 || jobsByStatus['paused'] > 0) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('stop')}
            disabled={isLoading}
          >
            <Square className="h-4 w-4 mr-2" />
            Stop All ({(jobsByStatus['processing'] || 0) + (jobsByStatus['paused'] || 0)})
          </Button>
        )}

        {(jobsByStatus['completed'] > 0 || jobsByStatus['failed'] > 0 || jobsByStatus['stopped'] > 0) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('retry')}
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry All ({(jobsByStatus['completed'] || 0) + (jobsByStatus['failed'] || 0) + (jobsByStatus['stopped'] || 0)})
          </Button>
        )}
      </div>
    </div>
  )
}
