"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, Video, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { mockClients, mockUsers, mockCourses, mockProgress } from "@/lib/mock-data"

// Calculate stats from mock data
const activeClients = mockClients.filter((c) => c.is_active).length
const totalUsers = mockUsers.filter((u) => u.role === "learner").length
const activeCourses = mockCourses.length
const completionRate = Math.round((mockProgress.filter((p) => p.completed).length / mockProgress.length) * 100) || 0

const stats = [
  {
    title: "Active Clients",
    value: String(activeClients),
    change: "All systems operational",
    icon: Building2,
    trend: "up",
  },
  {
    title: "Total Learners",
    value: String(totalUsers),
    change: "Across all clients",
    icon: Users,
    trend: "up",
  },
  {
    title: "Active Courses",
    value: String(activeCourses),
    change: "Multi-video courses",
    icon: Video,
    trend: "neutral",
  },
  {
    title: "Avg Completion",
    value: `${completionRate}%`,
    change: "Platform-wide progress",
    icon: TrendingUp,
    trend: "up",
  },
]

const completionData = [
  { month: "Week 1", completion: 45 },
  { month: "Week 2", completion: 58 },
  { month: "Week 3", completion: 67 },
  { month: "Week 4", completion: completionRate },
]

const courseDistribution = [
  { name: "AI Risk Foundations", value: 60, color: "#1E3A8A" },
  { name: "Responsible AI", value: 40, color: "#0D9488" },
]

const recentActivity = [
  { tenant: "Acme Corp", action: "Lee completed AI Risk Foundations", time: "2 hours ago", status: "success" },
  { tenant: "Acme Corp", action: "New learner added (Sam)", time: "4 hours ago", status: "info" },
  { tenant: "Acme Corp", action: "Track assigned to Pat", time: "6 hours ago", status: "info" },
]

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">Dashboard</h1>
        <p className="text-[#6B7280] mt-2">Overview of platform performance and client activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-[#E5E7EB]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#6B7280]">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-[#6B7280]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1F2937]">{stat.value}</div>
              <p className="text-xs text-[#6B7280] mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Client Activity */}
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-[#1F2937]">Client Activity</CardTitle>
          <CardDescription className="text-[#6B7280]">Performance metrics across organizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockClients.map((client) => {
              const clientUsers = mockUsers.filter((u) => u.client_id === client.id && u.role === "learner")
              const clientProgress = mockProgress.filter((p) => clientUsers.some((u) => u.id === p.user_id))
              const completed = clientProgress.filter((p) => p.completed).length
              const progress = clientProgress.length > 0 ? Math.round((completed / clientProgress.length) * 100) : 0

              return (
                <div key={client.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#1F2937]">{client.name}</p>
                      <p className="text-sm text-[#6B7280]">
                        {completed} of {clientProgress.length} items completed
                      </p>
                    </div>
                    <span className="text-sm font-medium text-[#1F2937]">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-[#1F2937]">Recent Activity</CardTitle>
          <CardDescription className="text-[#6B7280]">Latest updates across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="mt-1">
                  {activity.status === "success" && <CheckCircle className="h-5 w-5 text-[#10B981]" />}
                  {activity.status === "info" && <AlertCircle className="h-5 w-5 text-[#3B82F6]" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-[#1F2937]">{activity.tenant}</p>
                  <p className="text-sm text-[#6B7280]">{activity.action}</p>
                </div>
                <span className="text-xs text-[#6B7280]">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
