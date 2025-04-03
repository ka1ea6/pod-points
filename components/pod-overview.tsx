"use client";

import type React from "react";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { Sprint } from "@/payload-types";
import {
  getCurrentSprint,
  getLastSprint,
  getSprintStats,
} from "@/actions/sprints";
import { PodWithCount, SocketArgs, SprintStats } from "@/lib/types";
import { useSocket } from "@/providers/socket";

export function PodOverview() {
  const [pods, setPods] = useState<SprintStats[]>([]);
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);
  const [lastSprint, setLastSprint] = useState<Sprint | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    socket?.on("pods", (args: SocketArgs<PodWithCount>) => {
      if (args.operation === "create") {
        setPods((prev) => {
          return [...prev, { ...args.doc, memberCount: 0, points: 0 }];
        });
      } else {
        setPods((prev) => {
          return prev.map((el) => {
            if (el.id === args.doc.id) return args.doc;
            return el;
          });
        });
      }
    });
    socket?.on("sprints", (args: SocketArgs<PodWithCount>) => {
      fetchCurrentSprint();
    });
    socket?.on("point-updated", (args: SocketArgs<PodWithCount>) => {
      fetchStats();
    });

    return () => {
      socket?.off("pods");
      socket?.off("sprints");
    };
  }, [socket]);

  const fetchStats = useCallback(async () => {
    const { stats } = await getSprintStats();
    if (stats) setPods(stats);
  }, []);

  const fetchLastSprint = useCallback(async () => {
    const res = await getLastSprint();
    setLastSprint(res.sprint);
  }, []);

  const fetchCurrentSprint = useCallback(async () => {
    const res = await getCurrentSprint();
    setCurrentSprint(res);
    if (!res) fetchLastSprint();
  }, []);

  useEffect(() => {
    fetchStats();
    fetchCurrentSprint();
  }, []);

  const maxPoints = Math.max(...pods.map((pod) => pod.points));
  const totalPoints = pods.reduce((acc, pod) => acc + pod.points, 0);

  const daysLeft = useMemo(() => {
    if (!currentSprint) return null;
    const deadline = new Date(currentSprint.deadline).getTime();
    const now = Date.now();

    return Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  }, [currentSprint]);

  // const userPod = pods[0]; // Assuming user is in Red Pod

  return (
    <Card className="h-100 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Pod Overview</CardTitle>
          {(currentSprint || lastSprint) && (
            <div className="flex gap-2 items-center">
              <span>
                Sprint -{" "}
                {currentSprint ? currentSprint.title : lastSprint?.title}
              </span>
              <Badge variant="outline" className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{daysLeft} days left</span>
              </Badge>
            </div>
          )}
        </div>
        {/* <CardDescription>
          Your pod: <span style={{ color: userPod.color }}>{userPod.name}</span>
        </CardDescription> */}
      </CardHeader>
      <CardContent className="h-[calc(100%-4.5rem)]">
        <div className="space-y-4  h-full flex-1">
          {pods.length === 0 ? (
            <div className=" h-full flex items-center justify-center">
              <span className="font-bold">No pods yet</span>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
