"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '@/store/auth'
import { useSearchParams } from 'next/navigation'

export default function ProfilePage() {
  const {
    profile,
    isLoading,
    updateProfile,
    isUpdating,
  } = useProfile()

  const { user } = useAuthStore()

  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'profile'

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    job_title: '',
    bio: '',
  })

  // Update form data when profile loads
  useEffect(() => {
    if (profile?.profile) {
      setFormData({
        name: profile.profile.name || '',
        phone: profile.profile.phone || '',
        company: profile.profile.company || '',
        job_title: profile.profile.job_title || '',
        bio: profile.profile.bio || '',
      })
    }
  }, [profile])

  // Check if form data has changed
  const hasChanges = useMemo(() => {
    if (!profile?.profile) return false
    return (
      formData.name !== profile.profile.name ||
      formData.phone !== profile.profile.phone ||
      formData.company !== profile.profile.company ||
      formData.job_title !== profile.profile.job_title ||
      formData.bio !== profile.profile.bio
    )
  }, [formData, profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile(formData)
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings.
        </p>
      </div>
      <Separator />

      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isUpdating}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.profile?.email || user?.email || ''}
                    disabled={true}
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if you need to update your email.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isUpdating}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={isUpdating}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="job_title">Job Title</Label>
                  <Input
                    id="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    disabled={isUpdating}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={isUpdating}
                    rows={4}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isUpdating || !hasChanges}
                  >
                    {isUpdating ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
