"use client";

import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { getCurrentUser } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin-dashboard";
import { useAuth } from "@/providers/auth";

export default function AdminPage() {
  // const user = await getCurrentUser();
  const { user, userFetched, fetching } = useAuth();

  if (userFetched && !fetching && (!user || user.role !== "lead")) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      {/* {true ? ( */}
      {!userFetched || fetching ? (
        <div className="h-full flex-1 flex items-center justify-center">
          <div className="loader"></div>
        </div>
      ) : (
        <main className="flex-1 p-6 md:p-8 ">
          <AdminDashboard />
        </main>
      )}
    </div>
  );
}
