"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { PodOverview } from "@/components/pod-overview";
import { PointsActivity } from "@/components/points-activity";
import { TaskBoard } from "@/components/task-board";
import { RecurringTasks } from "@/components/recurring-tasks";
import { useAuth } from "@/providers/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";

export default function HomePage() {
  const { user, fetching, userFetched, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = useCallback(() => {
    login({ email, password });
  }, [email, password]);

  return (
    <>
      {user ? (
        <main className="flex-1 space-y-6 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <PodOverview />
            <PointsActivity />
          </div>
          <RecurringTasks />
          <TaskBoard />
        </main>
      ) : (
        <main className="w-full flex-1 border flex items-center justify-center">
          {fetching || !userFetched ? (
            <>
              <div className="loader"></div>
            </>
          ) : (
            <Card className="w-[350px]">
              <CardHeader className="text-center">
                <CardTitle>Log in</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        placeholder="Email"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        name="password"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleLogin}>Log in</Button>
              </CardFooter>
            </Card>
          )}
        </main>
      )}
    </>
  );
}
