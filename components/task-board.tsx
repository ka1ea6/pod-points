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
import { Plus, LinkIcon } from "lucide-react";
import { getAllTasks } from "@/actions/tasks";
import { Task } from "@/payload-types";

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
    approved: [],
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [pointRequest, setPointRequest] = useState<PointRequest>({
    taskTitle: "",
    points: 0,
    description: "",
    evidence: "",
  });

  const fetchTasks = useCallback(async () => {
    const res = await getAllTasks();
    setTasks(() => {
      return res.docs.reduce(
        (acc, curr) => {
          if (!Object.keys(acc).includes(curr.status))
            acc[curr.status] = [curr];
          else acc[curr.status].push(curr);

          return acc;
        },
        {} as Record<string, Task[]>
      );
    });
  }, []);

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
    { id: "approved", title: "Approved" },
  ];

  const nonRecurringTasks = Object.fromEntries(
    Object.entries(tasks).map(([status, taskList]) => [
      status,
      taskList.filter((task) => !task.isRecurring),
    ])
  );

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Task Board</CardTitle>
            <CardDescription>Drag tasks to change their status</CardDescription>
          </div>
          <Dialog
            open={isRequestModalOpen}
            onOpenChange={setIsRequestModalOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Request Points
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Request Points</DialogTitle>
                <DialogDescription>
                  Submit a request for points for a completed task.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePointRequest}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="taskTitle" className="text-right">
                      Task
                    </Label>
                    <Input
                      id="taskTitle"
                      value={pointRequest.taskTitle}
                      onChange={(e) =>
                        setPointRequest({
                          ...pointRequest,
                          taskTitle: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="points" className="text-right">
                      Points
                    </Label>
                    <Input
                      id="points"
                      type="number"
                      value={pointRequest.points}
                      onChange={(e) =>
                        setPointRequest({
                          ...pointRequest,
                          points: Number.parseInt(e.target.value),
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={pointRequest.description}
                      onChange={(e) =>
                        setPointRequest({
                          ...pointRequest,
                          description: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="evidence" className="text-right">
                      Evidence
                    </Label>
                    <Input
                      id="evidence"
                      value={pointRequest.evidence}
                      onChange={(e) =>
                        setPointRequest({
                          ...pointRequest,
                          evidence: e.target.value,
                        })
                      }
                      className="col-span-3"
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
        </div>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {columns.map((column) => (
              <div key={column.id} className="space-y-4">
                <div className="font-medium">{column.title}</div>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[200px] rounded-lg border bg-muted/40 p-2"
                    >
                      {nonRecurringTasks[column.id]?.map((task, index) => (
                        <Draggable
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
                    />
                    <Button size="icon" variant="outline">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Additional comments or context"
                    className="mt-2"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              {selectedTask?.status === "available" && (
                <Button>Claim Task</Button>
              )}
              {selectedTask?.status === "in-progress" && (
                <Button>Mark as Completed</Button>
              )}
              {selectedTask?.status === "completed" && (
                <Button>Submit for Approval</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
