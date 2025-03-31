import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { getCurrentUser } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin-dashboard";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <main className="flex-1 p-6 md:p-8">
        <AdminDashboard />
      </main>
    </div>
  );
}
