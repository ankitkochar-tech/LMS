"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Download, Share2 } from "lucide-react"
import { mockProgress, mockCourses, mockQuizAttempts } from "@/lib/mock-data"

// Lee Learner's data (user_id = "3")
const userId = "3"
const userProgress = mockProgress.filter((p) => p.user_id === userId)
const userQuizAttempts = mockQuizAttempts.filter((q) => q.user_id === userId && q.passed)

// Get completed courses
const completedCourseIds = new Set(userProgress.filter((p) => p.completed).map((p) => p.course_id))
const completedCourses = mockCourses.filter((c) => completedCourseIds.has(c.id))

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">Certificates</h1>
        <p className="text-[#6B7280] mt-2">Your earned completion certificates</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Total Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{completedCourses.length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Quizzes Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{userQuizAttempts.length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Avg Quiz Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">
              {userQuizAttempts.length > 0
                ? Math.round(userQuizAttempts.reduce((sum, a) => sum + a.score_percent, 0) / userQuizAttempts.length)
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates */}
      {completedCourses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {completedCourses.map((course) => {
            const courseProgress = userProgress.find((p) => p.course_id === course.id && p.completed)
            const completionDate = courseProgress ? new Date(courseProgress.updated_at) : new Date()

            return (
              <Card key={course.id} className="border-[#E5E7EB]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-[#10B981] text-white">
                      <Award className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                    <span className="text-sm text-[#6B7280]">{completionDate.toLocaleDateString()}</span>
                  </div>
                  <CardTitle className="mt-2 text-[#1F2937]">{course.title}</CardTitle>
                  <CardDescription className="text-[#6B7280]">Certificate of Completion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-[#1E3A8A] to-[#0D9488] rounded-lg p-6 text-white mb-4">
                    <div className="flex items-center justify-center mb-4">
                      <Award className="h-12 w-12" />
                    </div>
                    <h3 className="text-center text-lg font-semibold mb-2">Certificate of Completion</h3>
                    <p className="text-center text-sm opacity-90 mb-4">This certifies that</p>
                    <p className="text-center text-xl font-bold mb-4">Lee Learner</p>
                    <p className="text-center text-sm opacity-90 mb-2">has successfully completed</p>
                    <p className="text-center font-semibold mb-4">{course.title}</p>
                    <p className="text-center text-xs opacity-75">Issued by AIRX — AI Risk Experts</p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-[#F59E0B] hover:bg-[#D97706] text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" className="flex-1 border-[#E5E7EB] bg-transparent">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-[#E5E7EB]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-16 w-16 text-[#6B7280] mb-4" />
            <h3 className="text-lg font-semibold text-[#1F2937] mb-2">No Certificates Yet</h3>
            <p className="text-[#6B7280] text-center mb-4">Complete courses to earn certificates</p>
            <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white">Start Learning</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
