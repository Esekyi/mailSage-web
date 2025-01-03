'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Template } from '@/types/template'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash2, History } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ColumnsProps {
  onEdit: (template: Template) => void
  onDelete?: (template: Template) => void
  onViewHistory?: (template: Template) => void
}

export const columns = ({
  onEdit,
  onDelete,
  onViewHistory
}: ColumnsProps): ColumnDef<Template>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        {row.original.description && (
          <div className="text-sm text-muted-foreground">
            {row.original.description}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'version',
    header: 'Version',
    cell: ({ row }) => (
      <div className="hidden md:flex items-center gap-2">
        <span>v{row.original.version}</span>
        {row.original.version_info.is_latest && (
          <Badge variant="secondary">Latest</Badge>
        )}
        {row.original.version_info.published_at && (
          <Badge>Published</Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const utcDate = new Date(row.original.created_at)
      const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000)
      return formatDistanceToNow(localDate, {
        addSuffix: true,
        includeSeconds: true
      })
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const template = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(template)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            {onViewHistory && (
              <DropdownMenuItem onClick={() => onViewHistory(template)}>
                <History className="mr-2 h-4 w-4" />
                <span>History</span>
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(template)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
