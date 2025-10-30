"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreVertical, Trash2, BookOpen, List } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { mockAssignments, mockUsers, mockCourses, mockTracks, mockProgress, type Assignment } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AssignmentsPage() {
  const clientId = "1" // Acme Corp
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments.filter((a) => a.client_id === clientId))
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false)
  const [assignmentType, setAssignmentType] = useState<"course" | "track">("course")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedContent, setSelectedContent] = useState<string>("")
  const { toast } = useToast()

  const clientUsers = mockUsers.filter((u) => u.client_id === clientId && u.role === "learner")

  const handleAssign = () => {
    if (selectedUsers.length === 0 || !selectedContent) {
      toast({
        title: "Error",
        description: "Please select users and content to assign",
        variant: "destructive",
      })
      return
    }

    const newAssignments: Assignment[] = selectedUsers.map((userId, index) => ({
      id: String(assignments.length + index + 1),
      client_id: clientId,
      user_id: userId,
      course_id: assignmentType === "course" ? selectedContent : null,
      track_id: assignmentType === "track" ? selectedContent : null,
      assigned_by: "2", // Current admin
      assigned_at: new Date().toISOString(),
      due_at: null,
    }))

    setAssignments([...assignments, ...newAssignments])
    setSelectedUsers([])
    setSelectedContent("")
    setIsAssignDialogOpen(false)

    const contentName =
      assignmentType === "course"
        ? mockCourses.find((c) => c.id === selectedContent)?.title
        : mockTracks.find((t) => t.id === selectedContent)?.title

    toast({
      title: "Assignment Created",
      description: `${contentName} assigned to ${newAssignments.length} user(s).`,
    })
  }

  const handleRemoveAssignment = (id: string) => {
    setAssignments(assignments.filter((a) => a.id !== id))
    toast({
      title: "Assignment Removed",
      description: "The assignment has been removed.",
    })
  }

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleContent = (contentId: string) => {
    setSelectedContent(selectedContent === contentId ? "" : contentId)
  }

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId)
    setIsUserDetailOpen(true)
  }

  const getUserAssignmentDetails = (userId: string) => {
    const userAssignments = assignments.filter((a) => a.user_id === userId)
    return userAssignments.map((assignment) => {
      const course = assignment.course_id ? mockCourses.find((c) => c.id === assignment.course_id) : null
      const track = assignment.track_id ? mockTracks.find((t) => t.id === assignment.track_id) : null

      let status: "Pending" | "In Progress" | "Completed" = "Pending"
      if (assignment.course_id) {
        const courseProgress = mockProgress.filter((p) => p.user_id === userId && p.course_id === assignment.course_id)
        if (courseProgress.length > 0) {
          const allCompleted = courseProgress.every((p) => p.completed)
          status = allCompleted ? "Completed" : "In Progress"
        }
      }

      return {
        id: assignment.id,
        title: course ? course.title : track ? track.title : "Unknown",
        type: assignment.course_id ? "Course" : "Track",
        assignedDate: new Date(assignment.assigned_at).toLocaleDateString(),
        status,
      }
    })
  }

  const selectedUser = selectedUserId ? mockUsers.find((u) => u.id === selectedUserId) : null
  const userAssignmentDetails = selectedUserId ? getUserAssignmentDetails(selectedUserId) : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">Assignments</h1>
          <p className="text-[#6B7280] mt-2">Assign courses and tracks to learners</p>
        </div>
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0D9488] hover:bg-[#0F766E] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#1F2937]">Create New Assignment</DialogTitle>
              <DialogDescription className="text-[#6B7280]">
                Assign courses or tracks to selected users
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Assignment Type */}
              <Tabs value={assignmentType} onValueChange={(v) => setAssignmentType(v as "course" | "track")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="course">Course</TabsTrigger>
                  <TabsTrigger value="track">Track</TabsTrigger>
                </TabsList>
                <TabsContent value="course" className="space-y-2 mt-4">
                  <Label className="text-[#1F2937]">Select Course</Label>
                  <div className="border border-[#E5E7EB] rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                    {mockCourses.map((course) => (
                      <div key={course.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`course-${course.id}`}
                          checked={selectedContent === course.id}
                          onCheckedChange={() => toggleContent(course.id)}
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
                </TabsContent>
                <TabsContent value="track" className="space-y-2 mt-4">
                  <Label className="text-[#1F2937]">Select Track</Label>
                  <div className="border border-[#E5E7EB] rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                    {mockTracks.map((track) => (
                      <div key={track.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`track-${track.id}`}
                          checked={selectedContent === track.id}
                          onCheckedChange={() => toggleContent(track.id)}
                        />
                        <label
                          htmlFor={`track-${track.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-[#1F2937]"
                        >
                          {track.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* User Selection */}
              <div className="space-y-2">
                <Label className="text-[#1F2937]">Select Users</Label>
                <div className="border border-[#E5E7EB] rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                  {clientUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUser(user.id)}
                      />
                      <label
                        htmlFor={`user-${user.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-[#1F2937]"
                      >
                        {user.first_name} {user.last_name} ({user.email})
                      </label>
                    </div>
                  ))}
                </div>
                {selectedUsers.length > 0 && (
                  <p className="text-sm text-[#6B7280]">{selectedUsers.length} user(s) selected</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)} className="border-[#E5E7EB]">
                Cancel
              </Button>
              <Button onClick={handleAssign} className="bg-[#0D9488] hover:bg-[#0F766E] text-white">
                Create Assignment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Total Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{assignments.length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Course Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{assignments.filter((a) => a.course_id).length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Track Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{assignments.filter((a) => a.track_id).length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Unique Learners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{new Set(assignments.map((a) => a.user_id)).size}</div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments Table */}
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-[#1F2937]">All Assignments</CardTitle>
          <CardDescription className="text-[#6B7280]">View and manage course and track assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#E5E7EB]">
                <TableHead className="text-[#6B7280]">User</TableHead>
                <TableHead className="text-[#6B7280]">Content</TableHead>
                <TableHead className="text-[#6B7280]">Type</TableHead>
                <TableHead className="text-[#6B7280]">Assigned</TableHead>
                <TableHead className="text-right text-[#6B7280]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => {
                const user = mockUsers.find((u) => u.id === assignment.user_id)
                const course = assignment.course_id ? mockCourses.find((c) => c.id === assignment.course_id) : null
                const track = assignment.track_id ? mockTracks.find((t) => t.id === assignment.track_id) : null

                return (
                  <TableRow key={assignment.id} className="border-[#E5E7EB]">
                    <TableCell>
                      <button
                        onClick={() => handleUserClick(assignment.user_id)}
                        className="font-medium text-[#0D9488] hover:text-[#0F766E] hover:underline cursor-pointer"
                      >
                        {user?.first_name} {user?.last_name}
                      </button>
                    </TableCell>
                    <TableCell className="text-[#1F2937]">
                      {course ? course.title : track ? track.title : "Unknown"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          assignment.course_id ? "border-[#0D9488] text-[#0D9488]" : "border-[#7C3AED] text-[#7C3AED]"
                        }
                      >
                        {assignment.course_id ? (
                          <>
                            <BookOpen className="h-3 w-3 mr-1" />
                            Course
                          </>
                        ) : (
                          <>
                            <List className="h-3 w-3 mr-1" />
                            Track
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#6B7280]">
                      {new Date(assignment.assigned_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-[#EF4444]"
                            onClick={() => handleRemoveAssignment(assignment.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">
              {selectedUser?.first_name} {selectedUser?.last_name} - Assignment Details
            </DialogTitle>
            <DialogDescription className="text-[#6B7280]">
              View all courses assigned and their progress status
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow className="border-[#E5E7EB]">
                  <TableHead className="text-[#6B7280]">Course</TableHead>
                  <TableHead className="text-[#6B7280]">Type</TableHead>
                  <TableHead className="text-[#6B7280]">Date Assigned</TableHead>
                  <TableHead className="text-[#6B7280]">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userAssignmentDetails.length > 0 ? (
                  userAssignmentDetails.map((detail) => (
                    <TableRow key={detail.id} className="border-[#E5E7EB]">
                      <TableCell className="font-medium text-[#1F2937]">{detail.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            detail.type === "Course"
                              ? "border-[#0D9488] text-[#0D9488]"
                              : "border-[#7C3AED] text-[#7C3AED]"
                          }
                        >
                          {detail.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#6B7280]">{detail.assignedDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            detail.status === "Completed"
                              ? "border-[#10B981] text-[#10B981]"
                              : detail.status === "In Progress"
                                ? "border-[#F59E0B] text-[#F59E0B]"
                                : "border-[#6B7280] text-[#6B7280]"
                          }
                        >
                          {detail.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-[#6B7280] py-8">
                      No assignments found for this user
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDetailOpen(false)} className="border-[#E5E7EB]">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
