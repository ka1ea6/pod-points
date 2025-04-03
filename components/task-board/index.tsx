"use client";

import type React from "react";

import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, LinkIcon, User } from "lucide-react";
import {
  claimTask,
  completeTask,
  getAllTasks,
  submitTaskForApproval,
} from "@/actions/tasks";
import { Task } from "@/payload-types";
import RequestPointsDialog from "./request-points-dialog";
import { useSocket } from "@/providers/socket";
import { useAuth } from "@/providers/auth";
import { toast } from "sonner";
import { SocketArgs } from "@/lib/types";

// type Task = {
//   id: string;
//   title: string;
//   description: string;
//   points: number;
//   status: "available" | "in-progress" | "completed" | "approved";
//   assignee?: {
//     name: string;
//     avatar: string;
//   };
//   recurring: boolean;
// };

type PointRequest = {
  taskTitle: string;
  points: number;
  description: string;
  evidence: string;
};

export function TaskBoard() {
  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    available: [],
    "in-progress": [],
    completed: [],
    "pending-approval": [],
    approved: [],
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [approvalEvidence, setApprovalEvidence] = useState("");
  const [approvalDescription, setApprovalDescription] = useState("");
  const [pointRequest, setPointRequest] = useState<PointRequest>({
    taskTitle: "",
    points: 0,
    description: "",
    evidence: "",
  });

  const { user } = useAuth();

  const reduceTasksToCols = useCallback((tasks: Task[]) => {
    return tasks.reduce(
      (acc, curr) => {
        const currStatus = curr.status || "available";
        if (!Object.keys(acc).includes(currStatus)) acc[currStatus] = [curr];
        else acc[currStatus].push(curr);

        return acc;
      },
      {} as Record<string, Task[]>
    );
  }, []);

  const fetchTasks = useCallback(async () => {
    const res = await getAllTasks();
    setTasks(() => {
      return reduceTasksToCols(res.docs);
    });
  }, []);

  const { socket } = useSocket();

  useEffect(() => {
    socket?.on("tasks", (args: SocketArgs<Task>) => {
      if (args.doc.isRecurring) return;

      setTasks((prev) => {
        const copy = { ...prev };
        if (!args.doc.status) return copy;
        if (args.operation === "create") {
          if (copy[args.doc.status]) copy[args.doc.status].push(args.doc);
          else copy[args.doc.status] = [args.doc];
        } else {
          const items = Object.values(copy)
            .flat()
            .map((el) => (el.id === args.doc.id ? args.doc : el));

          return reduceTasksToCols(items);
        }
        return copy;
      });
    });
    return () => {
      socket?.off("tasks");
    };
  }, [socket]);

  useEffect(() => {
    fetchTasks();
  }, []);
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the task that was dragged
    const task = tasks[source.droppableId].find((t) => t.id === draggableId);
    if (!task) return;

    // Create new task lists
    const newTasks = { ...tasks };

    // Remove from source
    newTasks[source.droppableId] = newTasks[source.droppableId].filter(
      (t) => t.id !== draggableId
    );

    // Update task status
    const updatedTask = {
      ...task,
      status: destination.droppableId as
        | "available"
        | "in-progress"
        | "completed"
        | "pending-approval"
        | "approved",
      // Add assignee if moving to in-progress and doesn't have one
      assignee:
        destination.droppableId === "in-progress" && !task.assignee
          ? {
              name: "Alex Johnson",
              avatar: "/placeholder.svg?height=32&width=32",
            }
          : task.assignee,
    };

    // Add to destination
    // newTasks[destination.droppableId] = [
    //   ...newTasks[destination.droppableId].slice(0, destination.index),
    //   updatedTask,
    //   ...newTasks[destination.droppableId].slice(destination.index),
    // ];

    setTasks(newTasks);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handlePointRequest = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Point request submitted:", pointRequest);
    // Here you would typically send this data to your backend
    setIsRequestModalOpen(false);
    setPointRequest({
      taskTitle: "",
      points: 0,
      description: "",
      evidence: "",
    });
  };

  const columns = [
    { id: "available", title: "Available Tasks" },
    { id: "in-progress", title: "In Progress" },
    { id: "completed", title: "Completed" },
    { id: "pending-approval", title: "Pending approval" },
    { id: "approved", title: "Approved" },
  ];

  const nonRecurringTasks = Object.fromEntries(
    Object.entries(tasks).map(([status, taskList]) => [
      status,
      taskList.filter((task) => !task.isRecurring),
    ])
  );

  const onClaimTask = useCallback(
    async (taskId: number) => {
      if (!user) return;
      const task = await claimTask(taskId, user.id);
      toast.success(`Task claimed successfully.`);
      setIsDialogOpen(false);
    },
    [user]
  );
  const onCompleteTask = useCallback(
    async (taskId: number) => {
      if (!user) return;
      const task = await completeTask(taskId, user.id);
      toast.success(`Task completed successfully.`);
      setIsDialogOpen(false);
    },
    [user]
  );

  const onRequestApproval = useCallback(
    async (taskId: number) => {
      if (!user) return;
      const task = await submitTaskForApproval(
        taskId,
        approvalEvidence,
        approvalDescription
      );
      toast.success(`Task submitted for approval.`);
      setIsDialogOpen(false);
    },
    [user, approvalEvidence, approvalDescription]
  );

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Task Board</CardTitle>
            <CardDescription>Drag tasks to change their status</CardDescription>
          </div>
          <Button
            onClick={() => {
              setIsRequestModalOpen(true);
            }}
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Request Points
          </Button>
          {user && (
            <RequestPointsDialog
              open={isRequestModalOpen}
              setOpen={setIsRequestModalOpen}
              userId={user.id}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {columns.map((column) => (
              <div key={column.id} className="space-y-4">
                <div className="font-medium">{column.title}</div>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[200px] rounded-lg border bg-muted/40 p-2 max-h-[500px] overflow-y-scroll hide-scrollbar"
                    >
                      {nonRecurringTasks[column.id]?.map((task, index) => (
                        <Draggable
                          isDragDisabled
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2 cursor-pointer rounded-md border bg-card p-3 shadow-sm"
                              onClick={() => handleTaskClick(task)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="font-medium">
                                    {task.title}
                                  </div>
                                  <div className="line-clamp-2 text-xs text-muted-foreground">
                                    {task.description}
                                  </div>
                                </div>
                                <Badge variant="secondary">
                                  +{task.points}
                                </Badge>
                              </div>
                              {task.assignee &&
                                typeof task.assignee !== "number" && (
                                  <div className="mt-2 flex items-center">
                                    <Avatar className="h-5 w-5 mr-1">
                                      <AvatarImage
                                        // src={task.assignee.avatar}
                                        alt={task.assignee.name}
                                      />
                                      <AvatarFallback>
                                        {task.assignee.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-muted-foreground">
                                      {task.assignee.name}
                                    </span>
                                  </div>
                                )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedTask?.title}</DialogTitle>
              <DialogDescription>
                {selectedTask?.status === "available"
                  ? "Claim this task to earn points"
                  : selectedTask?.status === "completed"
                    ? "Submit evidence to get your points approved"
                    : selectedTask?.status === "approved"
                      ? "Points have been approved and added to your pod"
                      : "Complete this task to earn points"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <div className="rounded-md bg-muted p-3 text-sm">
                  {selectedTask?.description}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <Label>Points</Label>
                  <div className="font-medium">+{selectedTask?.points}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="font-medium capitalize">
                    {selectedTask?.status.replace("-", " ")}
                  </div>
                </div>
              </div>
              {selectedTask?.status === "completed" && (
                <div className="grid gap-2">
                  <Label htmlFor="evidence">Evidence</Label>
                  <div className="flex gap-2">
                    <Input
                      id="evidence"
                      placeholder="Link to evidence or description"
                      value={approvalEvidence}
                      onChange={(e) =>
                        setApprovalEvidence(e.currentTarget.value)
                      }
                    />
                    <Button size="icon" variant="outline">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Additional comments or context"
                    className="mt-2"
                    value={approvalDescription}
                    onChange={(e) =>
                      setApprovalDescription(e.currentTarget.value)
                    }
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              {selectedTask?.status === "available" && user && (
                <Button
                  onClick={() => {
                    onClaimTask(selectedTask.id);
                  }}
                >
                  Claim Task
                </Button>
              )}
              {selectedTask?.status === "in-progress" && (
                <Button
                  onClick={() => {
                    onCompleteTask(selectedTask.id);
                  }}
                >
                  Mark as Completed
                </Button>
              )}
              {selectedTask?.status === "completed" && (
                <Button
                  onClick={() => {
                    onRequestApproval(selectedTask.id);
                  }}
                >
                  Submit for Approval
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
