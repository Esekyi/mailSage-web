"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil, Trash2, Send } from 'lucide-react'

interface SMTPConfig {
  id: string
  name: string
  host: string
  port: number
  username: string
}

export default function SMTPConfigurations() {
  const [configs, setConfigs] = useState<SMTPConfig[]>([])
  const [newConfig, setNewConfig] = useState({ name: '', host: '', port: '', username: '', password: '' })
  const [editingConfig, setEditingConfig] = useState<SMTPConfig | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/v1/smtp/configs')
      if (response.ok) {
        const data = await response.json()
        setConfigs(data)
      } else {
        throw new Error('Failed to fetch SMTP configurations')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch SMTP configurations. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/v1/smtp/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "SMTP configuration added successfully.",
        })
        setNewConfig({ name: '', host: '', port: '', username: '', password: '' })
        fetchConfigs()
      } else {
        throw new Error('Failed to add SMTP configuration')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add SMTP configuration. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingConfig) return

    try {
      const response = await fetch(`/api/v1/smtp/configs/${editingConfig.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingConfig),
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "SMTP configuration updated successfully.",
        })
        setEditingConfig(null)
        fetchConfigs()
      } else {
        throw new Error('Failed to update SMTP configuration')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update SMTP configuration. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/smtp/configs/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "SMTP configuration deleted successfully.",
        })
        fetchConfigs()
      } else {
        throw new Error('Failed to delete SMTP configuration')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete SMTP configuration. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTest = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/smtp/configs/${id}/test`, {
        method: 'POST',
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "SMTP configuration tested successfully.",
        })
      } else {
        throw new Error('Failed to test SMTP configuration')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to test SMTP configuration. Please check your settings and try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">SMTP Configurations</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add SMTP Configuration</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add SMTP Configuration</DialogTitle>
            <DialogDescription>
              Enter the details for your new SMTP configuration.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newConfig.name}
                  onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  value={newConfig.host}
                  onChange={(e) => setNewConfig({ ...newConfig, host: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  type="number"
                  value={newConfig.port}
                  onChange={(e) => setNewConfig({ ...newConfig, port: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newConfig.username}
                  onChange={(e) => setNewConfig({ ...newConfig, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newConfig.password}
                  onChange={(e) => setNewConfig({ ...newConfig, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Configuration</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Port</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs.map((config) => (
            <TableRow key={config.id}>
              <TableCell>{config.name}</TableCell>
              <TableCell>{config.host}</TableCell>
              <TableCell>{config.port}</TableCell>
              <TableCell>{config.username}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit SMTP Configuration</DialogTitle>
                        <DialogDescription>
                          Update the details for your SMTP configuration.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleEdit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                              id="edit-name"
                              value={editingConfig?.name || ''}
                              onChange={(e) => setEditingConfig(prev => ({ ...prev!, name: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-host">Host</Label>
                            <Input
                              id="edit-host"
                              value={editingConfig?.host || ''}
                              onChange={(e) => setEditingConfig(prev => ({ ...prev!, host: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-port">Port</Label>
                            <Input
                              id="edit-port"
                              type="number"
                              value={editingConfig?.port || ''}
                              onChange={(e) => setEditingConfig(prev => ({ ...prev!, port: parseInt(e.target.value) }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-username">Username</Label>
                            <Input
                              id="edit-username"
                              value={editingConfig?.username || ''}
                              onChange={(e) => setEditingConfig(prev => ({ ...prev!, username: e.target.value }))}
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Update Configuration</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={() => handleTest(config.id)}>
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(config.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

