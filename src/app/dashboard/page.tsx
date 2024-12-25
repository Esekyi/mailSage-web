"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const emailData = [
  { name: 'Mon', sent: 145, opened: 98, clicked: 45 },
  { name: 'Tue', sent: 232, opened: 120, clicked: 55 },
  { name: 'Wed', sent: 186, opened: 110, clicked: 40 },
  { name: 'Thu', sent: 192, opened: 105, clicked: 48 },
  { name: 'Fri', sent: 216, opened: 123, clicked: 57 },
  { name: 'Sat', sent: 168, opened: 85, clicked: 30 },
  { name: 'Sun', sent: 134, opened: 76, clicked: 35 },
]

const bounceRateData = [
  { name: 'Mon', rate: 2.3 },
  { name: 'Tue', rate: 1.8 },
  { name: 'Wed', rate: 2.1 },
  { name: 'Thu', rate: 1.9 },
  { name: 'Fri', rate: 2.2 },
  { name: 'Sat', rate: 1.7 },
  { name: 'Sun', rate: 2.0 },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,273</div>
            <p className="text-xs text-muted-foreground">+5.1% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">58.3%</div>
            <p className="text-xs text-muted-foreground">+2.4% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.7%</div>
            <p className="text-xs text-muted-foreground">-0.8% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.9%</div>
            <p className="text-xs text-muted-foreground">-0.3% from last week</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Email Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emailData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="#8884d8" name="Sent" />
                <Bar dataKey="opened" fill="#82ca9d" name="Opened" />
                <Bar dataKey="clicked" fill="#ffc658" name="Clicked" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bounce Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bounceRateData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#8884d8" name="Bounce Rate (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

