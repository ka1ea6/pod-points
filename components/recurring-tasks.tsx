"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type RecurringTask = {
  id: string
  title: string
  description: string
  points: number
}

export function RecurringTasks() {
  const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>([
    {
      id: "recurring-1",
      title: "Weekly team meeting",
      description: "Attend and participate in the weekly team sync",
      points: 5,
    },
    {
      id: "recurring-2",
      title: "Daily standup",
      description: "Participate in the daily standup meeting",
      points: 2,
    },
    {
      id: "recurring-3",
      title: "Weekly code review",
      description: "Participate in the weekly code review session",
      points: 8,
    },
  ])

  const [selectedTask, setSelectedTask] = useState<RecurringTask | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [pointRequest, setPointRequest] = useState({
    description: "",
    evidence: "",
  })

  const handleTaskClick = (task: RecurringTask) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  const handlePointRequest = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Recurring task point request submitted:", { ...selectedTask, ...pointRequest })
    // Here you would typically send this data to your backend
    setIsDialogOpen(false)
    setPointRequest({ description: "", evidence: "" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurring Tasks</CardTitle>
        <CardDescription>Claim points for completed recurring tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recurringTasks.map((task) => (
            <Card key={task.id} className="cursor-pointer" onClick={() => handleTaskClick(task)}>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{task.title}</CardTitle>
                  <Badge variant="secondary">+{task.points}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedTask?.title}</DialogTitle>
              <DialogDescription>Submit a request for points for this recurring task.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePointRequest}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={pointRequest.description}
                    onChange={(e) => setPointRequest({ ...pointRequest, description: e.target.value })}
                    placeholder="Provide details about your participation"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="evidence">Evidence</Label>
                  <Input
                    id="evidence"
                    value={pointRequest.evidence}
                    onChange={(e) => setPointRequest({ ...pointRequest, evidence: e.target.value })}
                    placeholder="Link or description of evidence"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

