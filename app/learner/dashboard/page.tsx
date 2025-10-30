"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  mockAssignments,
  mockProgress,
  mockCourses,
  mockTracks,
  mockTrackCourses,
  mockVideos,
  mockQuizAttempts,
} from "@/lib/mock-data"

// Lee Learner's data (user_id = "3")
const userId = "3"
const userAssignments = mockAssignments.filter((a) => a.user_id === userId)
const userProgress = mockProgress.filter((p) => p.user_id === userId)
const userQuizAttempts = mockQuizAttempts.filter((q) => q.user_id === userId)

const completedCount = userProgress.filter((p) => p.completed).length
const totalItems = userProgress.length
const completionRate = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0

const stats = [
  {
    title: "Assigned Courses",
    value: String(userAssignments.length),
    change: "Active learning",
    icon: BookOpen,
  },
  {
    title: "In Progress",
    value: String(userProgress.filter((p) => !p.completed).length),
    change: "Keep going!",
    icon: Clock,
  },
  {
    title: "Completed",
    value: String(completedCount),
    change: "Great work!",
    icon: Award,
  },
  {
    title: "Overall Progress",
    value: `${completionRate}%`,
    change: "On track",
    icon: TrendingUp,
  },
]

export default function LearnerDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">Welcome back, Lee!</h1>
        <p className="text-[#6B7280] mt-2">Continue your AI risk awareness training</p>
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

      {/* Continue Learning */}
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-[#1F2937]">Continue Learning</CardTitle>
          <CardDescription className="text-[#6B7280]">Pick up where you left off</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userAssignments.map((assignment) => {
              const course = assignment.course_id ? mockCourses.find((c) => c.id === assignment.course_id) : null
              const track = assignment.track_id ? mockTracks.find((t) => t.id === assignment.track_id) : null

              if (course) {
                const courseVideos = mockVideos.filter((v) => v.course_id === course.id)
                const courseProgress = userProgress.filter((p) => p.course_id === course.id)
                const completed = courseProgress.filter((p) => p.completed).length
                const total = courseVideos.length
                const progress = total > 0 ? Math.round((completed / total) * 100) : 0

                return (
                  <Card key={assignment.id} className="border-[#E5E7EB]">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1F2937] mb-1">{course.title}</h3>
                          <p className="text-sm text-[#6B7280] mb-3">{course.description}</p>
                          <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                            <span>
                              {completed} of {total} videos
                            </span>
                            <Badge variant="outline" className="border-[#F59E0B] text-[#F59E0B]">
                              {progress}% complete
                            </Badge>
                          </div>
                        </div>
                        <Link href={`/learner/courses/${course.id}`}>
                          <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white">
                            {progress === 0 ? "Start" : "Continue"}
                          </Button>
                        </Link>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </CardContent>
                  </Card>
                )
              }

              if (track) {
                const trackCourseIds = mockTrackCourses
                  .filter((tc) => tc.track_id === track.id)
                  .map((tc) => tc.course_id)
                const trackCourses = mockCourses.filter((c) => trackCourseIds.includes(c.id))

                return (
                  <Card key={assignment.id} className="border-[#E5E7EB]">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1F2937] mb-1">{track.title}</h3>
                          <p className="text-sm text-[#6B7280] mb-3">{track.description}</p>
                          <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                            <span>{trackCourses.length} courses</span>
                            <Badge variant="outline" className="border-[#7C3AED] text-[#7C3AED]">
                              Learning Track
                            </Badge>
                          </div>
                        </div>
                        <Link href="/learner/courses">
                          <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white">View Track</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              }

              return null
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-[#1F2937]">Recent Activity</CardTitle>
          <CardDescription className="text-[#6B7280]">Your latest learning milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userQuizAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      attempt.passed ? "bg-[#D1FAE5]" : "bg-[#FEE2E2]",
                    )}
                  >
                    <Award className={cn("h-5 w-5", attempt.passed ? "text-[#10B981]" : "text-[#EF4444]")} />
                  </div>
                  <div>
                    <p className="font-medium text-[#1F2937]">Quiz Completed</p>
                    <p className="text-sm text-[#6B7280]">Score: {attempt.score_percent}%</p>
                  </div>
                </div>
                <Badge
                  variant={attempt.passed ? "default" : "secondary"}
                  className={attempt.passed ? "bg-[#10B981]" : ""}
                >
                  {attempt.passed ? "Passed" : "Failed"}
                </Badge>
              </div>
            ))}
            {userProgress
              .filter((p) => p.completed)
              .slice(0, 2)
              .map((progress) => {
                const video = mockVideos.find((v) => v.id === progress.video_id)
                return (
                  <div
                    key={progress.id}
                    className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-[#1E3A8A]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1F2937]">Video Completed</p>
                        <p className="text-sm text-[#6B7280]">{video?.title}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-[#10B981] text-[#10B981]">
                      Complete
                    </Badge>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
