"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Clock, Award, AlertTriangle } from "lucide-react"
import { mockClients, mockUsers, mockProgress, mockAssignments } from "@/lib/mock-data"

// Calculate real metrics from mock data
const totalLearners = mockUsers.filter((u) => u.role === "learner").length
const completedProgress = mockProgress.filter((p) => p.completed).length
const totalProgress = mockProgress.length
const avgCompletion = totalProgress > 0 ? Math.round((completedProgress / totalProgress) * 100) : 0

const platformTrend = [
  { date: "Week 1", users: totalLearners - 2, completions: completedProgress - 1, active: totalLearners - 1 },
  { date: "Week 2", users: totalLearners - 1, completions: completedProgress - 1, active: totalLearners },
  { date: "Week 3", users: totalLearners, completions: completedProgress, active: totalLearners },
  { date: "Week 4", users: totalLearners, completions: completedProgress, active: totalLearners },
]

const categoryPerformance = [
  { category: "AI Risk Foundations", enrolled: 2, completed: 1, avgScore: 100 },
  { category: "Responsible AI", enrolled: 1, completed: 0, avgScore: 0 },
]

const clientMetrics = mockClients.map((client) => {
  const clientUsers = mockUsers.filter((u) => u.client_id === client.id && u.role === "learner")
  const totalLearners = clientUsers.length
  const activeLearners = clientUsers.filter((u) => u.is_active).length

  const clientAssignments = mockAssignments.filter((a) => clientUsers.some((u) => u.id === a.user_id))
  const coursesAssigned = new Set(clientAssignments.map((a) => a.course_id || a.track_id)).size

  const clientProgress = mockProgress.filter((p) => clientUsers.some((u) => u.id === p.user_id))
  const completed = clientProgress.filter((p) => p.completed).length
  const completionRate = clientProgress.length > 0 ? Math.round((completed / clientProgress.length) * 100) : 0

  return {
    id: client.id,
    name: client.name,
    totalLearners,
    activeLearners,
    coursesAssigned,
    completionRate,
  }
})

const engagementMetrics = [
  { week: "Week 1", logins: 8, videoViews: 12, quizAttempts: 0 },
  { week: "Week 2", logins: 10, videoViews: 15, quizAttempts: 1 },
  { week: "Week 3", logins: 12, videoViews: 18, quizAttempts: 1 },
  { week: "Week 4", logins: 15, videoViews: 20, quizAttempts: 1 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">Platform Analytics</h1>
          <p className="text-[#6B7280] mt-2">Track progress and performance across all clients</p>
        </div>
        <Select defaultValue="30">
          <SelectTrigger className="w-40 border-[#E5E7EB]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#E5E7EB]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Active Learners</CardTitle>
            <Users className="h-4 w-4 text-[#6B7280]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{totalLearners}</div>
            <div className="flex items-center gap-1 text-xs text-[#10B981] mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>All active</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Avg Completion</CardTitle>
            <Clock className="h-4 w-4 text-[#6B7280]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{avgCompletion}%</div>
            <div className="flex items-center gap-1 text-xs text-[#10B981] mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>Platform-wide</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Quiz Attempts</CardTitle>
            <Award className="h-4 w-4 text-[#6B7280]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{mockAssignments.length}</div>
            <div className="flex items-center gap-1 text-xs text-[#10B981] mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>{mockAssignments.filter((a) => a.passed).length} passed</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Active Courses</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#6B7280]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{mockAssignments.length}</div>
            <div className="flex items-center gap-1 text-xs text-[#6B7280] mt-1">
              <span>Multi-video courses</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-[#1F2937]">Client Performance</CardTitle>
          <CardDescription className="text-[#6B7280]">
            Overview of learner activity and completion rates by client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#1F2937]">Client Name</TableHead>
                <TableHead className="text-[#1F2937]">Total Learners</TableHead>
                <TableHead className="text-[#1F2937]">Active Learners</TableHead>
                <TableHead className="text-[#1F2937]">Courses Assigned</TableHead>
                <TableHead className="text-[#1F2937]">Completion Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientMetrics.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium text-[#1F2937]">{client.name}</TableCell>
                  <TableCell className="text-[#6B7280]">{client.totalLearners}</TableCell>
                  <TableCell className="text-[#6B7280]">
                    <Badge variant="outline" className="border-[#10B981] text-[#10B981]">
                      {client.activeLearners}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#6B7280]">{client.coursesAssigned}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#1F2937]">{client.completionRate}%</span>
                      <div className="w-20 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                        <div className="h-full bg-[#0D9488]" style={{ width: `${client.completionRate}%` }} />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
