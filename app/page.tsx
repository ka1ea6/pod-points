import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { PodOverview } from "@/components/pod-overview"
import { PointsActivity } from "@/components/points-activity"
import { TaskBoard } from "@/components/task-board"
import { RecurringTasks } from "@/components/recurring-tasks"
import { getCurrentUser } from "@/lib/auth"

export default function HomePage() {
  const user = getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <main className="flex-1 space-y-6 p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <PodOverview />
          <PointsActivity />
        </div>
        <RecurringTasks />
        <TaskBoard />
      </main>
    </div>
  )
}

