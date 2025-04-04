"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, PlusCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useCallback, useEffect, useState } from "react";
import { getAllTasks } from "@/actions/tasks";
import { Task } from "@/payload-types";
import AddTaskDialog from "./add-task";
import DeleteTaskDialog from "./delete-task";
import EditTaskDialog from "./edit-task";
import { useAuth } from "@/providers/auth";
import { useSocket } from "@/providers/socket";
import { SocketArgs } from "@/lib/types";

const TasksTab = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [deleteTaskOpen, setDeleteTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    socket?.on("tasks", (args: SocketArgs<Task>) => {
      if (args.operation === "create") {
        setTasks((prev) => {
          return [...prev, args.doc];
        });
      } else {
        setTasks((prev) => {
          return prev.map((el) => {
            if (el.id === args.doc.id) return args.doc;
            return el;
          });
        });
      }
    });
    return () => {
      socket?.off("tasks");
    };
  }, [socket]);

  const fetchTasks = useCallback(async () => {
    const { docs: tasks } = await getAllTasks();
    setTasks(tasks);
  }, []);

  const handleAlterTask = useCallback((task: Task, mode: "edit" | "delete") => {
    setSelectedTask(task);
    mode === "edit" ? setEditTaskOpen(true) : setDeleteTaskOpen(true);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  const getStatus = (value: Task["status"]) => {
    switch (value) {
      case "available":
        return <Badge variant={"default"}>Available</Badge>;
      case "in-progress":
        return <Badge variant={"default"}>In progress</Badge>;
      case "completed":
        return <Badge variant={"default"}>Completed</Badge>;
      case "pending-approval":
        return <Badge variant={"default"}>Pending approval</Badge>;
      case "approved":
        return <Badge variant={"default"}>Approved</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Tasks</CardTitle>
              <CardDescription>
                Create and edit tasks and point values
              </CardDescription>
            </div>
            <Button onClick={() => setAddTaskOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Task
            </Button>
            {addTaskOpen && (
              <AddTaskDialog open={addTaskOpen} setOpen={setAddTaskOpen} />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Assigned to</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks
                .filter((el) => !el.isRecurring && !el.fromRecurring)
                .map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <span className="font-medium">{task.title}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">+{task.points}</Badge>
                    </TableCell>
                    <TableCell>
                      <span>{task.assignee?.name}</span>
                    </TableCell>
                    <TableCell>
                      <span>{getStatus(task.status)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAlterTask(task, "edit")}
                          size="sm"
                          variant="outline"
                        >
                          Edit
                        </Button>

                        {task.status === "available" && (
                          <>
                            <Button
                              onClick={() => handleAlterTask(task, "delete")}
                              size="sm"
                              variant="outline"
                              className="text-red-500"
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {editTaskOpen && selectedTask && user && (
            <EditTaskDialog
              open={editTaskOpen}
              setOpen={setEditTaskOpen}
              task={selectedTask}
            />
          )}
          {deleteTaskOpen && selectedTask && user && (
            <DeleteTaskDialog
              open={deleteTaskOpen}
              setOpen={setDeleteTaskOpen}
              taskId={selectedTask.id}
              userId={user.id}
            />
          )}
          {tasks.length === 0 && (
            <div className="flex justify-center py-4">
              <span className="font-bold text-lg">No tasks yet.</span>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recurring tasks</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Assigned to</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks
                .filter((el) => el.fromRecurring)
                .map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <span className="font-medium">{task.title}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">+{task.points}</Badge>
                    </TableCell>
                    <TableCell>
                      <span>{task.assignee?.name}</span>
                    </TableCell>
                    <TableCell>
                      <span>{getStatus(task.status)}</span>
                    </TableCell>
                    {/* <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAlterTask(task, "edit")}
                          size="sm"
                          variant="outline"
                        >
                          Edit
                        </Button>

                        {task.status === "available" && (
                          <>
                            <Button
                              onClick={() => handleAlterTask(task, "delete")}
                              size="sm"
                              variant="outline"
                              className="text-red-500"
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {editTaskOpen && selectedTask && user && (
            <EditTaskDialog
              open={editTaskOpen}
              setOpen={setEditTaskOpen}
              task={selectedTask}
            />
          )}
          {deleteTaskOpen && selectedTask && user && (
            <DeleteTaskDialog
              open={deleteTaskOpen}
              setOpen={setDeleteTaskOpen}
              taskId={selectedTask.id}
              userId={user.id}
            />
          )}
          {tasks.length === 0 && (
            <div className="flex justify-center py-4">
              <span className="font-bold text-lg">No tasks yet.</span>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recurring task templates</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks
                .filter((el) => el.isRecurring)
                .map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <span className="font-medium">{task.title}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{task.description}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">+{task.points}</Badge>
                    </TableCell>
                    {/* <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAlterTask(task, "edit")}
                          size="sm"
                          variant="outline"
                        >
                          Edit
                        </Button>

                        {task.status === "available" && (
                          <>
                            <Button
                              onClick={() => handleAlterTask(task, "delete")}
                              size="sm"
                              variant="outline"
                              className="text-red-500"
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {editTaskOpen && selectedTask && user && (
            <EditTaskDialog
              open={editTaskOpen}
              setOpen={setEditTaskOpen}
              task={selectedTask}
            />
          )}
          {deleteTaskOpen && selectedTask && user && (
            <DeleteTaskDialog
              open={deleteTaskOpen}
              setOpen={setDeleteTaskOpen}
              taskId={selectedTask.id}
              userId={user.id}
            />
          )}
          {tasks.length === 0 && (
            <div className="flex justify-center py-4">
              <span className="font-bold text-lg">No tasks yet.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Request Volunteers</CardTitle>
          <CardDescription>
            Create tasks that team members can volunteer for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input id="task-title" placeholder="Enter task title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-description">Description</Label>
              <Input
                id="task-description"
                placeholder="Enter task description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-points">Points</Label>
                <Input id="task-points" type="number" placeholder="10" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-deadline">Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Pick a date</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button>Create Volunteer Task</Button>
          </div>
        </CardContent>
      </Card> */}
    </>
  );
};

export default TasksTab;
