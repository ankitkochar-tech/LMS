"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, CheckCircle, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockUsers, mockAssignments, mockProgress } from "@/lib/mock-data"

// Filter data for Acme Corp (client_id = "1")
const clientId = "1"
const clientUsers = mockUsers.filter((u) => u.client_id === clientId && u.role === "learner")
const clientAssignments = mockAssignments.filter((a) => a.client_id === clientId)
const clientProgress = mockProgress.filter((p) => clientUsers.some((u) => u.id === p.user_id))

const completedCount = clientProgress.filter((p) => p.completed).length
const totalProgress = clientProgress.length
const completionRate = totalProgress > 0 ? Math.round((completedCount / totalProgress) * 100) : 0

const stats = [
  {
    title: "Total Learners",
    value: String(clientUsers.length),
    change: "All active",
    icon: Users,
  },
  {
    title: "Active Assignments",
    value: String(clientAssignments.length),
    change: "Courses & tracks",
    icon: BookOpen,
  },
  {
    title: "Completion Rate",
    value: `${completionRate}%`,
    change: "Platform average",
    icon: CheckCircle,
  },
  {
    title: "Avg Progress",
    value: `${completionRate}%`,
    change: "Across all users",
    icon: Clock,
  },
]

export default function ClientAdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">Dashboard</h1>
        <p className="text-[#6B7280] mt-2">Overview of your organization's training progress</p>
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

      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-[#1F2937]">Learner Overview</CardTitle>
          <CardDescription className="text-[#6B7280]">
            Detailed learner information and completion status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#E5E7EB]">
                <TableHead className="text-[#6B7280]">Learner Name</TableHead>
                <TableHead className="text-[#6B7280]">Onboarding Date</TableHead>
                <TableHead className="text-[#6B7280]">Assignments</TableHead>
                <TableHead className="text-[#6B7280]">Completion Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientUsers.map((user) => {
                const userProgress = clientProgress.filter((p) => p.user_id === user.id)
                const userCompleted = userProgress.filter((p) => p.completed).length
                const userTotal = userProgress.length
                const userRate = userTotal > 0 ? Math.round((userCompleted / userTotal) * 100) : 0
                const userAssignments = clientAssignments.filter((a) => a.user_id === user.id)

                return (
                  <TableRow key={user.id} className="border-[#E5E7EB]">
                    <TableCell className="font-medium text-[#1F2937]">
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell className="text-[#6B7280]">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-[#1F2937]">{userAssignments.length}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#E5E7EB] rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-[#0D9488] h-2 rounded-full transition-all"
                            style={{ width: `${userRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-[#1F2937] min-w-[45px]">{userRate}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
