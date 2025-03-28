"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestsTab from "./tabs/requests";
import PodsTab from "./tabs/pods";
import TasksTab from "./tabs/tasks";
import MembersTab from "./tabs/members";

export function AdminDashboard() {
  return (
    <Tabs defaultValue="requests">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <TabsList>
          <TabsTrigger value="requests">Pending Requests</TabsTrigger>
          <TabsTrigger value="pods">Manage Pods</TabsTrigger>
          <TabsTrigger value="tasks">Manage Tasks</TabsTrigger>
          <TabsTrigger value="members">Manage Members</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="requests" className="space-y-4">
        <RequestsTab />
      </TabsContent>

      <TabsContent value="pods" className="space-y-4">
        <PodsTab />
      </TabsContent>

      <TabsContent value="tasks" className="space-y-4">
        <TasksTab />
      </TabsContent>

      <TabsContent value="members" className="space-y-4">
        <MembersTab />
      </TabsContent>
    </Tabs>
  );
}
