import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"
import { DashboardHeader } from "@/components/dashboard-header"
import { getCurrentUser } from "@/lib/auth"

export default function AdminPage() {
  const user = getCurrentUser()

  if (!user || user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <main className="flex-1 p-6 md:p-8">
        <AdminDashboard />
      </main>
    </div>
  )
}

