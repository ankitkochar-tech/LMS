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
import { Plus, Search, MoreVertical, Edit, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

type Partner = {
  id: string
  name: string
  email: string
  clients: number
  licenses: number
  status: "active" | "inactive"
  createdAt: string
}

const initialPartners: Partner[] = [
  {
    id: "1",
    name: "TechConsult Partners",
    email: "admin@techconsult.com",
    clients: 12,
    licenses: 500,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Global Training Solutions",
    email: "contact@globaltraining.com",
    clients: 8,
    licenses: 300,
    status: "active",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Enterprise Learning Co",
    email: "info@enterpriselearning.com",
    clients: 15,
    licenses: 750,
    status: "active",
    createdAt: "2024-03-10",
  },
]

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(initialPartners)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPartner, setNewPartner] = useState({
    name: "",
    email: "",
    licenses: "",
  })
  const { toast } = useToast()

  const filteredPartners = partners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddPartner = () => {
    if (!newPartner.name || !newPartner.email || !newPartner.licenses) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const partner: Partner = {
      id: String(partners.length + 1),
      name: newPartner.name,
      email: newPartner.email,
      clients: 0,
      licenses: Number.parseInt(newPartner.licenses),
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setPartners([...partners, partner])
    setNewPartner({ name: "", email: "", licenses: "" })
    setIsAddDialogOpen(false)

    toast({
      title: "Partner Added",
      description: `${partner.name} has been successfully added to the platform.`,
    })
  }

  const handleDeletePartner = (id: string) => {
    setPartners(partners.filter((p) => p.id !== id))
    toast({
      title: "Partner Deleted",
      description: "The partner has been removed from the platform.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partner Tenants</h1>
          <p className="text-muted-foreground mt-2">Manage distributors and reseller partners</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Partner</DialogTitle>
              <DialogDescription>Create a new partner tenant to onboard distributors and resellers</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Partner Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., TechConsult Partners"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@partner.com"
                  value={newPartner.email}
                  onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenses">License Quota</Label>
                <Input
                  id="licenses"
                  type="number"
                  placeholder="500"
                  value={newPartner.licenses}
                  onChange={(e) => setNewPartner({ ...newPartner, licenses: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPartner}>Create Partner</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners.reduce((sum, p) => sum + p.clients, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Licenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners.reduce((sum, p) => sum + p.licenses, 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Partners Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Partners</CardTitle>
              <CardDescription>View and manage partner accounts</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search partners..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Clients</TableHead>
                <TableHead>Licenses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{partner.email}</TableCell>
                  <TableCell>{partner.clients}</TableCell>
                  <TableCell>{partner.licenses}</TableCell>
                  <TableCell>
                    <Badge variant={partner.status === "active" ? "default" : "secondary"}>{partner.status}</Badge>
                  </TableCell>
                  <TableCell>{partner.createdAt}</TableCell>
                  <TableCell className="text-right">
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
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeletePartner(partner.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
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
