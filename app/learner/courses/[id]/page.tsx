"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Play, CheckCircle2, Clock, BookOpen, Target } from "lucide-react"
import { mockCourses, mockVideos, mockQuizzes } from "@/lib/mock-data"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const course = mockCourses.find((c) => c.id === courseId)
  const videos = mockVideos.filter((v) => v.course_id === courseId).sort((a, b) => a.position - b.position)
  const quiz = mockQuizzes.find((q) => q.course_id === courseId)

  const [completedVideos, setCompletedVideos] = useState<string[]>([])

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#6B7280]">Course not found</p>
      </div>
    )
  }

  const totalVideos = videos.length
  const progress = totalVideos > 0 ? (completedVideos.length / totalVideos) * 100 : 0

  const learningObjectives =
    courseId === "1"
      ? [
          "Understand the fundamental concepts of AI risk and governance",
          "Identify key risk categories including bias, hallucination, and privacy concerns",
          "Learn the importance of AI safety frameworks in organizational contexts",
          "Apply risk assessment principles to real-world AI scenarios",
        ]
      : [
          "Master the Purpose-Data-Review framework for responsible AI use",
          "Implement daily AI usage checks in your workflow",
          "Recognize ethical considerations when working with AI tools",
          "Apply best practices for data handling and AI output validation",
        ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-[#6B7280]">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">{course.title}</h1>
          <p className="text-[#6B7280] mt-2">{course.description}</p>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="border-[#E5E7EB]">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#1F2937]">Course Progress</span>
            <span className="text-sm text-[#6B7280]">
              {completedVideos.length} of {totalVideos} videos completed
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Overview */}
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#1E3A8A]" />
                <CardTitle className="text-[#1F2937]">Course Overview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#1F2937] mb-2">About This Course</h3>
                <p className="text-[#6B7280] leading-relaxed">{course.description}</p>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#6B7280]" />
                  <span className="text-sm text-[#6B7280]">
                    {Math.ceil(videos.reduce((acc, v) => acc + v.duration_seconds, 0) / 60)} min total
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-[#6B7280]" />
                  <span className="text-sm text-[#6B7280]">{totalVideos} videos</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#0D9488]" />
                <CardTitle className="text-[#1F2937]">Learning Objectives</CardTitle>
              </div>
              <CardDescription className="text-[#6B7280]">What you'll learn in this course</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <span className="text-[#1F2937]">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Video Playlist */}
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-[#1F2937]">Course Content</CardTitle>
              <CardDescription className="text-[#6B7280]">Watch videos in sequence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {videos.map((video, index) => {
                const isCompleted = completedVideos.includes(video.id)
                return (
                  <div
                    key={video.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F3F4F6] text-[#6B7280] text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-[#1F2937]">{video.title}</h4>
                        <p className="text-sm text-[#6B7280]">{Math.ceil(video.duration_seconds / 60)} min</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <Badge className="bg-[#10B981] text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-[#F59E0B] hover:bg-[#D97706] text-white"
                          onClick={() => setCompletedVideos([...completedVideos, video.id])}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Watch
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Quiz Section */}
          {quiz && (
            <Card className="border-[#E5E7EB]">
              <CardHeader>
                <CardTitle className="text-[#1F2937]">Course Quiz</CardTitle>
                <CardDescription className="text-[#6B7280]">
                  Complete the quiz to finish this course (Pass threshold: {quiz.pass_threshold}%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white"
                  disabled={completedVideos.length < totalVideos}
                >
                  {completedVideos.length < totalVideos ? "Complete all videos first" : "Start Quiz"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-[#1F2937]">Course Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Completion</p>
                <p className="text-2xl font-bold text-[#1F2937]">{Math.round(progress)}%</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Videos Watched</p>
                <p className="text-2xl font-bold text-[#1F2937]">
                  {completedVideos.length}/{totalVideos}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Time Remaining</p>
                <p className="text-2xl font-bold text-[#1F2937]">
                  {Math.ceil(
                    videos
                      .filter((v) => !completedVideos.includes(v.id))
                      .reduce((acc, v) => acc + v.duration_seconds, 0) / 60,
                  )}{" "}
                  min
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
