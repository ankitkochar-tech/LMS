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
import { Plus, MoreVertical, Edit, Trash2, Eye, BookOpen } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { mockTracks, mockTrackCourses, mockCourses, type Track, type TrackCourse } from "@/lib/mock-data"

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>(mockTracks)
  const [trackCourses, setTrackCourses] = useState<TrackCourse[]>(mockTrackCourses)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTrack, setNewTrack] = useState({
    title: "",
    description: "",
    selectedCourses: [] as string[],
  })
  const { toast } = useToast()

  const handleCreateTrack = () => {
    if (!newTrack.title || !newTrack.description || newTrack.selectedCourses.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select at least one course",
        variant: "destructive",
      })
      return
    }

    const trackId = String(tracks.length + 1)
    const track: Track = {
      id: trackId,
      title: newTrack.title,
      description: newTrack.description,
      created_at: new Date().toISOString(),
    }

    const newTrackCourses: TrackCourse[] = newTrack.selectedCourses.map((courseId, index) => ({
      track_id: trackId,
      course_id: courseId,
      position: index + 1,
    }))

    setTracks([...tracks, track])
    setTrackCourses([...trackCourses, ...newTrackCourses])
    setNewTrack({ title: "", description: "", selectedCourses: [] })
    setIsCreateDialogOpen(false)

    toast({
      title: "Track Created",
      description: `${track.title} with ${newTrackCourses.length} courses has been created.`,
    })
  }

  const getTrackCourses = (trackId: string) => {
    return trackCourses
      .filter((tc) => tc.track_id === trackId)
      .sort((a, b) => a.position - b.position)
      .map((tc) => mockCourses.find((c) => c.id === tc.course_id))
      .filter(Boolean)
  }

  const toggleCourse = (courseId: string) => {
    setNewTrack((prev) => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(courseId)
        ? prev.selectedCourses.filter((id) => id !== courseId)
        : [...prev.selectedCourses, courseId],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">Learning Tracks</h1>
          <p className="text-[#6B7280] mt-2">Group courses into structured learning paths</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Track
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#1F2937]">Create New Track</DialogTitle>
              <DialogDescription className="text-[#6B7280]">
                Group multiple courses into a learning path
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="track-title" className="text-[#1F2937]">
                  Track Title
                </Label>
                <Input
                  id="track-title"
                  placeholder="e.g., AI Risk Awareness Track"
                  value={newTrack.title}
                  onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
                  className="border-[#E5E7EB]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="track-description" className="text-[#1F2937]">
                  Description
                </Label>
                <Textarea
                  id="track-description"
                  placeholder="Brief description of the learning path..."
                  rows={3}
                  value={newTrack.description}
                  onChange={(e) => setNewTrack({ ...newTrack, description: e.target.value })}
                  className="border-[#E5E7EB]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#1F2937]">Select Courses (in order)</Label>
                <div className="border border-[#E5E7EB] rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
                  {mockCourses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`course-${course.id}`}
                        checked={newTrack.selectedCourses.includes(course.id)}
                        onCheckedChange={() => toggleCourse(course.id)}
                      />
                      <label
                        htmlFor={`course-${course.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-[#1F2937]"
                      >
                        {course.title}
                      </label>
                    </div>
                  ))}
                </div>
                {newTrack.selectedCourses.length > 0 && (
                  <p className="text-sm text-[#6B7280]">{newTrack.selectedCourses.length} courses selected</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-[#E5E7EB]">
                Cancel
              </Button>
              <Button onClick={handleCreateTrack} className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white">
                Create Track
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Total Tracks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{tracks.length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{trackCourses.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tracks Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {tracks.map((track) => {
          const courses = getTrackCourses(track.id)

          return (
            <Card key={track.id} className="border-[#E5E7EB]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#7C3AED]" />
                    <Badge variant="outline" className="border-[#7C3AED] text-[#7C3AED]">
                      {courses.length} courses
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
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
                <CardTitle className="mt-2 text-[#1F2937]">{track.title}</CardTitle>
                <CardDescription className="text-[#6B7280]">{track.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#1F2937]">Course Sequence:</p>
                  <div className="space-y-2">
                    {courses.map((course, index) => (
                      <div key={course?.id} className="flex items-center gap-2 text-sm">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#DBEAFE] text-[#1E3A8A] text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="text-[#1F2937]">{course?.title}</span>
                      </div>
                    ))}
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
