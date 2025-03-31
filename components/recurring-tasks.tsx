"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getRecurringTasks, submitTaskForApproval } from "@/actions/tasks";
import { Task } from "@/payload-types";
import { useAuth } from "@/providers/auth";

export function RecurringTasks() {
  const [recurringTasks, setRecurringTasks] = useState<Task[]>([]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pointRequest, setPointRequest] = useState({
    description: "",
    evidence: "",
  });

  const { user } = useAuth();

  const fetchTasks = useCallback(async () => {
    const res = await getRecurringTasks();
    if (res.tasks) setRecurringTasks(res.tasks.docs);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handlePointRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recurring task point request submitted:", {
      ...selectedTask,
      ...pointRequest,
    });
    if (!selectedTask?.id || !user?.id) return;

    const res = await submitTaskForApproval(
      selectedTask?.id,
      user?.id,
      pointRequest.evidence,
      pointRequest.description
    );

    // Here you would typically send this data to your backend
    setIsDialogOpen(false);
    setPointRequest({ description: "", evidence: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurring Tasks</CardTitle>
        <CardDescription>
          Claim points for completed recurring tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recurringTasks.map((task) => (
            <Card
              key={task.id}
              className="cursor-pointer"
              onClick={() => handleTaskClick(task)}
            >
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{task.title}</CardTitle>
                  <Badge variant="secondary">+{task.points}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedTask?.title}</DialogTitle>
              <DialogDescription>
                Submit a request for points for this recurring task.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePointRequest}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={pointRequest.description}
                    onChange={(e) =>
                      setPointRequest({
                        ...pointRequest,
                        description: e.target.value,
                      })
                    }
                    placeholder="Provide details about your participation"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="evidence">Evidence</Label>
                  <Input
                    id="evidence"
                    value={pointRequest.evidence}
                    onChange={(e) =>
                      setPointRequest({
                        ...pointRequest,
                        evidence: e.target.value,
                      })
                    }
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
  );
}
