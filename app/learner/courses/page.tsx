"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, PlayCircle } from "lucide-react"
import Link from "next/link"
import { mockAssignments, mockProgress, mockCourses, mockVideos, mockTracks, mockTrackCourses } from "@/lib/mock-data"

// Lee Learner's data (user_id = "3")
const userId = "3"
const userAssignments = mockAssignments.filter((a) => a.user_id === userId)
const userProgress = mockProgress.filter((p) => p.user_id === userId)

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">My Courses</h1>
        <p className="text-[#6B7280] mt-2">Your assigned learning content</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Total Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{userAssignments.length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{userProgress.filter((p) => !p.completed).length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{userProgress.filter((p) => p.completed).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {userAssignments.map((assignment) => {
          const course = assignment.course_id ? mockCourses.find((c) => c.id === assignment.course_id) : null
          const track = assignment.track_id ? mockTracks.find((t) => t.id === assignment.track_id) : null

          if (course) {
            const courseVideos = mockVideos.filter((v) => v.course_id === course.id)
            const courseProgress = userProgress.filter((p) => p.course_id === course.id)
            const completed = courseProgress.filter((p) => p.completed).length
            const total = courseVideos.length
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0
            const totalDuration = courseVideos.reduce((sum, v) => sum + v.duration_seconds, 0)

            return (
              <Card key={assignment.id} className="border-[#E5E7EB] flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="border-[#0D9488] text-[#0D9488]">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Course
                    </Badge>
                    <Badge
                      variant={progress === 100 ? "default" : "secondary"}
                      className={progress === 100 ? "bg-[#10B981]" : ""}
                    >
                      {progress}%
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-[#1F2937]">{course.title}</CardTitle>
                  <CardDescription className="text-[#6B7280]">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B7280]">Videos</span>
                      <span className="font-medium text-[#1F2937]">
                        {completed} / {total}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B7280]">Duration</span>
                      <span className="font-medium text-[#1F2937]">{Math.round(totalDuration / 60)} min</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <Link href={`/learner/courses/${course.id}`}>
                    <Button className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      {progress === 0 ? "Start Course" : progress === 100 ? "Review" : "Continue"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          }

          if (track) {
            const trackCourseIds = mockTrackCourses.filter((tc) => tc.track_id === track.id).map((tc) => tc.course_id)
            const trackCourses = mockCourses.filter((c) => trackCourseIds.includes(c.id))

            return (
              <Card key={assignment.id} className="border-[#E5E7EB] flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="border-[#7C3AED] text-[#7C3AED]">
                      Learning Track
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-[#1F2937]">{track.title}</CardTitle>
                  <CardDescription className="text-[#6B7280]">{track.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-[#1F2937]">Courses in this track:</p>
                    {trackCourses.map((course, index) => (
                      <div key={course.id} className="flex items-center gap-2 text-sm">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F3E8FF] text-[#7C3AED] text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="text-[#1F2937]">{course.title}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Track
                  </Button>
                </CardContent>
              </Card>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
