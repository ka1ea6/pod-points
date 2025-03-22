"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"

export function PodOverview() {
  const [pods, setPods] = useState([
    { id: 1, name: "Red Pod", color: "#ef4444", points: 320, members: 5 },
    { id: 2, name: "Blue Pod", color: "#3b82f6", points: 280, members: 4 },
    { id: 3, name: "Green Pod", color: "#10b981", points: 350, members: 6 },
  ])

  const maxPoints = Math.max(...pods.map((pod) => pod.points))
  const daysLeft = 14
  const userPod = pods[0] // Assuming user is in Red Pod

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
        <CardDescription>
          Your pod: <span style={{ color: userPod.color }}>{userPod.name}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pods.map((pod) => (
            <div key={pod.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: pod.color }} />
                  <span className="font-medium">{pod.name}</span>
                </div>
                <span className="text-sm">
                  {pod.points} pts ({pod.points / pod.members} per member)
                </span>
              </div>
              <Progress
                value={(pod.points / maxPoints) * 100}
                className="h-2"
                indicatorClassName={`bg-[${pod.color}]`}
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
  )
}

