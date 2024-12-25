"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
}

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [newTemplate, setNewTemplate] = useState({ name: '', subject: '', body: '' })
  const { toast } = useToast()

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/v1/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      } else {
        throw new Error('Failed to fetch email templates')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch email templates. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/v1/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate),
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Email template added successfully.",
        })
        setNewTemplate({ name: '', subject: '', body: '' })
        fetchTemplates()
      } else {
        throw new Error('Failed to add email template')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add email template. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/templates/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Email template deleted successfully.",
        })
        fetchTemplates()
      } else {
        throw new Error('Failed to delete email template')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete email template. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Email Templates</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={newTemplate.subject}
            onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="body">Body</Label>
          <Textarea
            id="body"
            value={newTemplate.body}
            onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
            required
          />
        </div>
        <Button type="submit">Add Template</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>{template.name}</TableCell>
              <TableCell>{template.subject}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(template.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

