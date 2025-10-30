"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreVertical, Edit, Trash2, Eye, GripVertical, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import {
  mockCourses,
  mockVideos,
  mockQuizzes,
  mockQuestions,
  type Course,
  type Video,
  type Quiz,
  type Question,
} from "@/lib/mock-data"

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [videos, setVideos] = useState<Video[]>(mockVideos)
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes)
  const [questions, setQuestions] = useState<Question[]>(mockQuestions)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
  })
  const [newVideos, setNewVideos] = useState<Array<{ title: string; url: string; duration: number }>>([])
  const [newQuiz, setNewQuiz] = useState({
    pass_threshold: 70,
    questions: [{ prompt: "", options: ["", "", ""], correct_index: 0, explanation: "" }],
  })
  const { toast } = useToast()

  const handleAddVideo = () => {
    setNewVideos([...newVideos, { title: "", url: "", duration: 0 }])
  }

  const handleRemoveVideo = (index: number) => {
    setNewVideos(newVideos.filter((_, i) => i !== index))
  }

  const handleAddQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { prompt: "", options: ["", "", ""], correct_index: 0, explanation: "" }],
    })
  }

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.description || newVideos.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in course details and add at least one video",
        variant: "destructive",
      })
      return
    }

    const courseId = String(courses.length + 1)
    const course: Course = {
      id: courseId,
      title: newCourse.title,
      description: newCourse.description,
      thumbnail_url: `/placeholder.svg?height=200&width=400&query=${encodeURIComponent(newCourse.title)}`,
      created_by: "1",
      created_at: new Date().toISOString(),
    }

    // Add videos
    const courseVideos: Video[] = newVideos.map((v, index) => ({
      id: String(videos.length + index + 1),
      course_id: courseId,
      title: v.title,
      url: v.url,
      position: index + 1,
      duration_seconds: v.duration * 60,
      created_at: new Date().toISOString(),
    }))

    // Add quiz if questions exist
    if (newQuiz.questions.some((q) => q.prompt)) {
      const quizId = String(quizzes.length + 1)
      const quiz: Quiz = {
        id: quizId,
        course_id: courseId,
        pass_threshold: newQuiz.pass_threshold,
        created_at: new Date().toISOString(),
      }

      const quizQuestions: Question[] = newQuiz.questions
        .filter((q) => q.prompt)
        .map((q, index) => ({
          id: String(questions.length + index + 1),
          quiz_id: quizId,
          prompt: q.prompt,
          options: q.options.filter((o) => o),
          correct_index: q.correct_index,
          explanation: q.explanation,
        }))

      setQuizzes([...quizzes, quiz])
      setQuestions([...questions, ...quizQuestions])
    }

    setCourses([...courses, course])
    setVideos([...videos, ...courseVideos])
    setNewCourse({ title: "", description: "" })
    setNewVideos([])
    setNewQuiz({
      pass_threshold: 70,
      questions: [{ prompt: "", options: ["", "", ""], correct_index: 0, explanation: "" }],
    })
    setIsCreateDialogOpen(false)

    toast({
      title: "Course Created",
      description: `${course.title} with ${courseVideos.length} videos has been published.`,
    })
  }

  const getCourseVideos = (courseId: string) => {
    return videos.filter((v) => v.course_id === courseId).sort((a, b) => a.position - b.position)
  }

  const getCourseQuiz = (courseId: string) => {
    return quizzes.find((q) => q.course_id === courseId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">Course Library</h1>
          <p className="text-[#6B7280] mt-2">Create multi-video courses with quizzes</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#1F2937]">Create New Course</DialogTitle>
              <DialogDescription className="text-[#6B7280]">
                Add course details, upload multiple videos, and create a quiz
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Course Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1F2937]">Course Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#1F2937]">
                    Course Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., AI Risk Foundations"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    className="border-[#E5E7EB]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#1F2937]">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the course..."
                    rows={3}
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    className="border-[#E5E7EB]"
                  />
                </div>
              </div>

              {/* Videos */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#1F2937]">Videos (Ordered Playlist)</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddVideo}
                    className="border-[#E5E7EB] bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Video
                  </Button>
                </div>
                {newVideos.map((video, index) => (
                  <Card key={index} className="border-[#E5E7EB]">
                    <CardContent className="pt-4">
                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <GripVertical className="h-5 w-5 text-[#6B7280]" />
                          <span className="ml-2 text-sm font-medium text-[#6B7280]">#{index + 1}</span>
                        </div>
                        <div className="flex-1 space-y-3">
                          <Input
                            placeholder="Video title"
                            value={video.title}
                            onChange={(e) => {
                              const updated = [...newVideos]
                              updated[index].title = e.target.value
                              setNewVideos(updated)
                            }}
                            className="border-[#E5E7EB]"
                          />
                          <div className="flex gap-2">
                            <Input
                              placeholder="Video URL or upload MP4"
                              value={video.url}
                              onChange={(e) => {
                                const updated = [...newVideos]
                                updated[index].url = e.target.value
                                setNewVideos(updated)
                              }}
                              className="flex-1 border-[#E5E7EB]"
                            />
                            <Input
                              type="number"
                              placeholder="Duration (min)"
                              value={video.duration || ""}
                              onChange={(e) => {
                                const updated = [...newVideos]
                                updated[index].duration = Number.parseInt(e.target.value) || 0
                                setNewVideos(updated)
                              }}
                              className="w-32 border-[#E5E7EB]"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveVideo(index)}
                          className="text-[#EF4444]"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quiz Builder */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1F2937]">Quiz (Optional)</h3>
                <div className="space-y-2">
                  <Label htmlFor="threshold" className="text-[#1F2937]">
                    Pass Threshold (%)
                  </Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={newQuiz.pass_threshold}
                    onChange={(e) => setNewQuiz({ ...newQuiz, pass_threshold: Number.parseInt(e.target.value) || 70 })}
                    className="w-32 border-[#E5E7EB]"
                  />
                </div>
                {newQuiz.questions.map((question, qIndex) => (
                  <Card key={qIndex} className="border-[#E5E7EB]">
                    <CardContent className="pt-4 space-y-3">
                      <Input
                        placeholder={`Question ${qIndex + 1}`}
                        value={question.prompt}
                        onChange={(e) => {
                          const updated = { ...newQuiz }
                          updated.questions[qIndex].prompt = e.target.value
                          setNewQuiz(updated)
                        }}
                        className="border-[#E5E7EB]"
                      />
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex gap-2">
                          <Input
                            placeholder={`Option ${oIndex + 1}`}
                            value={option}
                            onChange={(e) => {
                              const updated = { ...newQuiz }
                              updated.questions[qIndex].options[oIndex] = e.target.value
                              setNewQuiz(updated)
                            }}
                            className="border-[#E5E7EB]"
                          />
                          <Button
                            type="button"
                            variant={question.correct_index === oIndex ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const updated = { ...newQuiz }
                              updated.questions[qIndex].correct_index = oIndex
                              setNewQuiz(updated)
                            }}
                            className={
                              question.correct_index === oIndex
                                ? "bg-[#10B981] hover:bg-[#059669] text-white"
                                : "border-[#E5E7EB]"
                            }
                          >
                            Correct
                          </Button>
                        </div>
                      ))}
                      <Input
                        placeholder="Explanation (optional)"
                        value={question.explanation}
                        onChange={(e) => {
                          const updated = { ...newQuiz }
                          updated.questions[qIndex].explanation = e.target.value
                          setNewQuiz(updated)
                        }}
                        className="border-[#E5E7EB]"
                      />
                    </CardContent>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddQuestion}
                  className="border-[#E5E7EB] bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-[#E5E7EB]">
                Cancel
              </Button>
              <Button onClick={handleCreateCourse} className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white">
                Publish Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{courses.length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Total Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{videos.length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Total Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{quizzes.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const courseVideos = getCourseVideos(course.id)
          const courseQuiz = getCourseQuiz(course.id)
          const totalDuration = courseVideos.reduce((sum, v) => sum + v.duration_seconds, 0)

          return (
            <Card key={course.id} className="flex flex-col border-[#E5E7EB]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className="border-[#0D9488] text-[#0D9488]">
                    {courseVideos.length} videos
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[#EF4444]">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="mt-2 text-[#1F2937]">{course.title}</CardTitle>
                <CardDescription className="text-[#6B7280]">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Duration</span>
                    <span className="font-medium text-[#1F2937]">{Math.round(totalDuration / 60)} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Videos</span>
                    <span className="font-medium text-[#1F2937]">{courseVideos.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Quiz</span>
                    <span className="font-medium text-[#1F2937]">
                      {courseQuiz ? `${courseQuiz.pass_threshold}% pass` : "None"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
