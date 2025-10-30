"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Upload, BookOpen, FolderTree } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { mockClients, mockUsers, mockCourses, mockTracks, type Client } from "@/lib/mock-data"
import { Checkbox } from "@/components/ui/checkbox"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])
  const [newClient, setNewClient] = useState({
    name: "",
    logo_url: "",
    primary_color: "#1E3A8A",
  })
  const { toast } = useToast()

  const filteredClients = clients.filter((client) => client.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddClient = () => {
    if (!newClient.name) {
      toast({
        title: "Error",
        description: "Please enter organization name",
        variant: "destructive",
      })
      return
    }

    const client: Client = {
      id: String(clients.length + 1),
      name: newClient.name,
      logo_url: newClient.logo_url,
      primary_color: newClient.primary_color,
      is_active: true,
      created_at: new Date().toISOString(),
    }

    setClients([...clients, client])
    setNewClient({ name: "", logo_url: "", primary_color: "#1E3A8A" })
    setIsAddDialogOpen(false)

    toast({
      title: "Client Created",
      description: `${client.name} has been successfully added. Invite email will be sent to the client admin.`,
    })
  }

  const handleAssignContent = () => {
    if (!selectedClient) return

    if (selectedCourses.length === 0 && selectedTracks.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one course or track",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Content Assigned",
      description: `${selectedCourses.length} course(s) and ${selectedTracks.length} track(s) assigned to ${selectedClient.name}`,
    })

    setIsAssignDialogOpen(false)
    setSelectedClient(null)
    setSelectedCourses([])
    setSelectedTracks([])
  }

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter((c) => c.id !== id))
    toast({
      title: "Client Deleted",
      description: "The client has been removed from the platform.",
    })
  }

  const handleOpenAssignDialog = (client: Client) => {
    setSelectedClient(client)
    setIsAssignDialogOpen(true)
  }

  const getClientStats = (clientId: string) => {
    const users = mockUsers.filter((u) => u.client_id === clientId && u.role === "learner")
    return {
      users: users.length,
      admins: mockUsers.filter((u) => u.client_id === clientId && u.role === "client_admin").length,
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">Client Organizations</h1>
          <p className="text-[#6B7280] mt-2">Manage client tenants and branding</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#1F2937]">Create New Client</DialogTitle>
              <DialogDescription className="text-[#6B7280]">
                Add a new client organization to the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="client-name" className="text-[#1F2937]">
                  Organization Name
                </Label>
                <Input
                  id="client-name"
                  placeholder="e.g., Acme Corp"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="border-[#E5E7EB]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-[#1F2937]">
                  Logo URL (Optional)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="logo"
                    placeholder="https://example.com/logo.png"
                    value={newClient.logo_url}
                    onChange={(e) => setNewClient({ ...newClient, logo_url: e.target.value })}
                    className="border-[#E5E7EB]"
                  />
                  <Button variant="outline" size="icon" className="border-[#E5E7EB] bg-transparent">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color" className="text-[#1F2937]">
                  Primary Color
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={newClient.primary_color}
                    onChange={(e) => setNewClient({ ...newClient, primary_color: e.target.value })}
                    className="w-20 h-10 border-[#E5E7EB]"
                  />
                  <Input
                    value={newClient.primary_color}
                    onChange={(e) => setNewClient({ ...newClient, primary_color: e.target.value })}
                    placeholder="#1E3A8A"
                    className="border-[#E5E7EB]"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-[#E5E7EB]">
                Cancel
              </Button>
              <Button onClick={handleAddClient} className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white">
                Create Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{clients.length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{clients.filter((c) => c.is_active).length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Total Learners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">
              {mockUsers.filter((u) => u.role === "learner").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Client Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">
              {mockUsers.filter((u) => u.role === "client_admin").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1F2937]">All Clients</CardTitle>
              <CardDescription className="text-[#6B7280]">View and manage client organizations</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Search clients..."
                className="pl-8 border-[#E5E7EB]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#E5E7EB]">
                <TableHead className="text-[#6B7280]">Organization</TableHead>
                <TableHead className="text-[#6B7280]">Branding</TableHead>
                <TableHead className="text-[#6B7280]">Users</TableHead>
                <TableHead className="text-[#6B7280]">Status</TableHead>
                <TableHead className="text-[#6B7280]">Created</TableHead>
                <TableHead className="text-right text-[#6B7280]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => {
                const stats = getClientStats(client.id)
                return (
                  <TableRow key={client.id} className="border-[#E5E7EB]">
                    <TableCell>
                      <p className="font-medium text-[#1F2937]">{client.name}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: client.primary_color }} />
                        <span className="text-sm text-[#6B7280]">{client.primary_color}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#1F2937]">
                      {stats.users} learners, {stats.admins} admin(s)
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={client.is_active ? "default" : "secondary"}
                        className={client.is_active ? "bg-[#10B981] text-white" : ""}
                      >
                        {client.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#6B7280]">{new Date(client.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenAssignDialog(client)}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Assign Content
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Branding
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[#EF4444]" onClick={() => handleDeleteClient(client.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
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

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">Assign Content to {selectedClient?.name}</DialogTitle>
            <DialogDescription className="text-[#6B7280]">
              Select courses and tracks to assign to this client organization
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Courses Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#1E3A8A]" />
                <Label className="text-[#1F2937] font-semibold">Courses</Label>
              </div>
              <div className="space-y-2 pl-7">
                {mockCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`course-${course.id}`}
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCourses([...selectedCourses, course.id])
                        } else {
                          setSelectedCourses(selectedCourses.filter((id) => id !== course.id))
                        }
                      }}
                    />
                    <label
                      htmlFor={`course-${course.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {course.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracks Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-[#0D9488]" />
                <Label className="text-[#1F2937] font-semibold">Tracks</Label>
              </div>
              <div className="space-y-2 pl-7">
                {mockTracks.map((track) => (
                  <div key={track.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`track-${track.id}`}
                      checked={selectedTracks.includes(track.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTracks([...selectedTracks, track.id])
                        } else {
                          setSelectedTracks(selectedTracks.filter((id) => id !== track.id))
                        }
                      }}
                    />
                    <label
                      htmlFor={`track-${track.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {track.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAssignDialogOpen(false)
                setSelectedClient(null)
                setSelectedCourses([])
                setSelectedTracks([])
              }}
              className="border-[#E5E7EB]"
            >
              Cancel
            </Button>
            <Button onClick={handleAssignContent} className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white">
              Assign Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
