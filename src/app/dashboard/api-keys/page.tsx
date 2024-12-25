"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface APIKey {
  id: string
  name: string
  key: string
  createdAt: string
}

export default function APIKeys() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [newKeyName, setNewKeyName] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchAPIKeys()
  }, [])

  const fetchAPIKeys = async () => {
    try {
      const response = await fetch('/api/v1/auth/api-keys')
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data)
      } else {
        throw new Error('Failed to fetch API keys')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch API keys. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/v1/auth/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "API key generated successfully.",
        })
        setNewKeyName('')
        fetchAPIKeys()
      } else {
        throw new Error('Failed to generate API key')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate API key. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRevoke = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/auth/api-keys/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "API key revoked successfully.",
        })
        fetchAPIKeys()
      } else {
        throw new Error('Failed to revoke API key')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke API key. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">API Keys</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Enter key name"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            required
          />
          <Button type="submit">Generate New Key</Button>
        </div>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((apiKey) => (
            <TableRow key={apiKey.id}>
              <TableCell>{apiKey.name}</TableCell>
              <TableCell>{apiKey.key}</TableCell>
              <TableCell>{new Date(apiKey.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => handleRevoke(apiKey.id)}>Revoke</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

