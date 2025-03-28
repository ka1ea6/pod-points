"use client";

import type React from "react";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { getAllPods } from "@/actions/pods";
import { Pod, Sprint } from "@/payload-types";
import { getCurrentSprint } from "@/actions/sprints";
import { PodWithCount } from "@/lib/types";

export function PodOverview() {
  const [pods, setPods] = useState<PodWithCount[]>([]);
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);

  const fetchPods = useCallback(async () => {
    const res = await getAllPods();
    if (res.pods) setPods(res.pods);
  }, []);

  const fetchCurrentSprint = useCallback(async () => {
    const res = await getCurrentSprint();
    setCurrentSprint(res.sprint);
  }, []);

  useEffect(() => {
    fetchPods();
    fetchCurrentSprint();
  }, []);

  const maxPoints = Math.max(...pods.map((pod) => pod.points));
  const totalPoints = pods.reduce((acc, pod) => acc + pod.points, 0);

  const daysLeft = useMemo(() => {
    if (!currentSprint) return 0;
    const deadline = new Date(currentSprint.deadline).getTime();
    const now = Date.now();

    return Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  }, [currentSprint]);
  // const userPod = pods[0]; // Assuming user is in Red Pod

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Pod Overview</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{daysLeft} days left</span>
          </Badge>
        </div>
        {/* <CardDescription>
          Your pod: <span style={{ color: userPod.color }}>{userPod.name}</span>
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pods.map((pod) => (
            <div key={pod.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: pod.color }}
                  />
                  <span className="font-medium">{pod.name}</span>
                </div>
                {
                  <span className="text-sm">
                    {pod.points} pts (
                    {pod.memberCount ? pod.points / pod.memberCount : 0} per
                    member)
                  </span>
                }
              </div>
              <Progress
                value={(pod.points / totalPoints) * 100}
                className="h-2"
                style={
                  {
                    "--progress-background": pod.color,
                  } as React.CSSProperties
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
