"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = searchParams.get("role") || "employee"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const roleConfig = {
    "super-admin": {
      title: "Super Admin Portal",
      description: "Manage the entire platform ecosystem",
      redirect: "/super-admin",
    },
    partner: {
      title: "Partner Portal",
      description: "Manage your client portfolio",
      redirect: "/partner",
    },
    client: {
      title: "Client Admin Portal",
      description: "Manage employee training and compliance",
      redirect: "/client",
    },
    employee: {
      title: "Employee Portal",
      description: "Access your training courses",
      redirect: "/employee",
    },
  }

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.employee

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock authentication - in production, this would call an API
    localStorage.setItem("userRole", role)
    localStorage.setItem("userEmail", email)
    router.push(config.redirect)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-accent" />
          </div>
          <CardTitle className="text-2xl">{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <a href="#" className="hover:text-accent">
              Forgot password?
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
