import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Building2, GraduationCap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DBEAFE] via-[#F9FAFB] to-[#CCFBF1]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-[#1E3A8A]" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-balance text-[#1F2937]">AIRX — AI Risk Experts</h1>
          <p className="text-xl text-[#6B7280] text-balance">Microlearning platform for AI Risk awareness training</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow border-[#E5E7EB]">
            <CardHeader>
              <Shield className="h-10 w-10 text-[#1E3A8A] mb-2" />
              <CardTitle className="text-[#1F2937]">Super Admin</CardTitle>
              <CardDescription className="text-[#6B7280]">Manage clients, courses, and platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/super-admin">
                <Button className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white">Access Portal</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-[#E5E7EB]">
            <CardHeader>
              <Building2 className="h-10 w-10 text-[#0D9488] mb-2" />
              <CardTitle className="text-[#1F2937]">Client Admin</CardTitle>
              <CardDescription className="text-[#6B7280]">Onboard users and assign training</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/client-admin">
                <Button className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white">Access Portal</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-[#E5E7EB]">
            <CardHeader>
              <GraduationCap className="h-10 w-10 text-[#F59E0B] mb-2" />
              <CardTitle className="text-[#1F2937]">Learner</CardTitle>
              <CardDescription className="text-[#6B7280]">Complete courses and take quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/learner">
                <Button className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white">Access Portal</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-[#6B7280]">AI Risk awareness training for modern organizations</p>
        </div>
      </div>
    </div>
  )
}
