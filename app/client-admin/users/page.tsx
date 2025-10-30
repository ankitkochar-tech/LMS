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
import { Plus, Search, MoreVertical, Edit, Trash2, Upload } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { mockUsers, type User } from "@/lib/mock-data"

export default function UsersPage() {
  const clientId = "1" // Acme Corp
  const [users, setUsers] = useState<User[]>(mockUsers.filter((u) => u.client_id === clientId && u.role === "learner"))
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    email: "",
    first_name: "",
    last_name: "",
  })
  const [bulkEmails, setBulkEmails] = useState("")
  const { toast } = useToast()

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddUser = () => {
    if (!newUser.email || !newUser.first_name || !newUser.last_name) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const user: User = {
      id: String(users.length + 100),
      client_id: clientId,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      role: "learner",
      is_active: true,
      created_at: new Date().toISOString(),
    }

    setUsers([...users, user])
    setNewUser({ email: "", first_name: "", last_name: "" })
    setIsAddDialogOpen(false)

    toast({
      title: "User Added",
      description: `${user.first_name} ${user.last_name} has been invited via email.`,
    })
  }

  const handleBulkAdd = () => {
    const emails = bulkEmails.split("\n").filter((e) => e.trim())
    if (emails.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one email address",
        variant: "destructive",
      })
      return
    }

    const newUsers: User[] = emails.map((email, index) => ({
      id: String(users.length + 100 + index),
      client_id: clientId,
      email: email.trim(),
      first_name: "New",
      last_name: "User",
      role: "learner",
      is_active: true,
      created_at: new Date().toISOString(),
    }))

    setUsers([...users, ...newUsers])
    setBulkEmails("")
    setIsBulkDialogOpen(false)

    toast({
      title: "Users Added",
      description: `${newUsers.length} users have been invited via email.`,
    })
  }

  const handleDeactivateUser = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, is_active: false } : u)))
    toast({
      title: "User Deactivated",
      description: "The user has been deactivated but their history is retained.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">Users</h1>
          <p className="text-[#6B7280] mt-2">Manage learners in your organization</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-[#E5E7EB] bg-transparent">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-[#1F2937]">Bulk Add Users</DialogTitle>
                <DialogDescription className="text-[#6B7280]">
                  Enter email addresses (one per line) to invite multiple users
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="bulk-emails" className="text-[#1F2937]">
                    Email Addresses
                  </Label>
                  <Textarea
                    id="bulk-emails"
                    placeholder="user1@acme.com&#10;user2@acme.com&#10;user3@acme.com"
                    rows={8}
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    className="border-[#E5E7EB] font-mono text-sm"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)} className="border-[#E5E7EB]">
                  Cancel
                </Button>
                <Button onClick={handleBulkAdd} className="bg-[#0D9488] hover:bg-[#0F766E] text-white">
                  Add Users
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0D9488] hover:bg-[#0F766E] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-[#1F2937]">Add New User</DialogTitle>
                <DialogDescription className="text-[#6B7280]">
                  Invite a new learner to your organization
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-[#1F2937]">
                    First Name
                  </Label>
                  <Input
                    id="first-name"
                    placeholder="John"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    className="border-[#E5E7EB]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name" className="text-[#1F2937]">
                    Last Name
                  </Label>
                  <Input
                    id="last-name"
                    placeholder="Doe"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    className="border-[#E5E7EB]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#1F2937]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@acme.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="border-[#E5E7EB]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-[#E5E7EB]">
                  Cancel
                </Button>
                <Button onClick={handleAddUser} className="bg-[#0D9488] hover:bg-[#0F766E] text-white">
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{users.length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{users.filter((u) => u.is_active).length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">Inactive Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">{users.filter((u) => !u.is_active).length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#6B7280]">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2937]">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1F2937]">All Users</CardTitle>
              <CardDescription className="text-[#6B7280]">View and manage learners</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Search users..."
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
                <TableHead className="text-[#6B7280]">Name</TableHead>
                <TableHead className="text-[#6B7280]">Email</TableHead>
                <TableHead className="text-[#6B7280]">Status</TableHead>
                <TableHead className="text-[#6B7280]">Joined</TableHead>
                <TableHead className="text-right text-[#6B7280]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-[#E5E7EB]">
                  <TableCell className="font-medium text-[#1F2937]">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell className="text-[#6B7280]">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.is_active ? "default" : "secondary"}
                      className={user.is_active ? "bg-[#10B981] text-white" : ""}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#6B7280]">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[#EF4444]" onClick={() => handleDeactivateUser(user.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
