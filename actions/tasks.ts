"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { Task, User } from "@/payload-types";
import { z } from "zod";
import { getId } from "@/lib/utils";
import { getCurrentSprint } from "./sprints";
import { getUser } from "./users";

const createTaskSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  link: z.string(),
  points: z.coerce.number(),
  assignee: z.string().optional(),
  isRecurring: z.string().optional(),
});

export async function createTask(prevState: any, formData: FormData) {
  const formEntry = Object.fromEntries(formData);
  const { success, data, error } = createTaskSchema.safeParse(formEntry);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      data: formEntry,
    };
  }

  const payload = await getPayload({ config });

  try {
    let assignedUser: User | null = null;

    if (data.assignee)
      assignedUser = await payload.findByID({
        collection: "users",
        id: data.assignee,
      });

    const sprint = await getCurrentSprint();

    const isDataRecurring = data.isRecurring === "on";

    const newTask = await payload.create({
      collection: "tasks",
      data: {
        ...data,
        isRecurring: isDataRecurring,
        assignee: isDataRecurring ? null : assignedUser,
        status: assignedUser ? "in-progress" : "available",
        sprint: isDataRecurring ? null : sprint,
      },
    });

    return { status: "success", task: newTask };
  } catch (err) {
    console.error("err", err);
    if ((err as any).rawCode === 2067) {
      return {
        errors: {
          color: ["Color must be unique"],
        },
      };
    }
  }
}

export async function getAllTasks() {
  const payload = await getPayload({ config });

  const tasks = await payload.find({
    collection: "tasks",
    depth: 2,
  });

  return tasks;
}

export async function getRecurringTasks() {
  const payload = await getPayload({ config });

  const tasks = await payload.find({
    collection: "tasks",
    where: {
      isRecurring: {
        equals: true,
      },
    },
  });

  return { status: "success", tasks };
}

export async function getTasksByStatus(status: Task["status"]) {
  const payload = await getPayload({ config });

  const tasks = await payload.find({
    collection: "tasks",
    depth: 2,
    where: {
      status: {
        equals: status,
      },
    },
  });

  return tasks;
}

const updateTaskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  link: z.string(),
  points: z.coerce.number(),
  assignee: z.string().optional(),
  taskId: z.string().min(1, { message: "Task is required." }),
});

export async function updateTask(prevState: any, formData: FormData) {
  const formEntry = Object.fromEntries(formData);
  const { success, data, error } = updateTaskSchema.safeParse(formEntry);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      data: formEntry,
    };
  }

  const payload = await getPayload({ config });

  let assignedUser: User | null = null;

  if (data.assignee)
    assignedUser = await payload.findByID({
      collection: "users",
      id: data.assignee,
    });

  const updatedTask = await payload.update({
    collection: "tasks",
    id: data.taskId,
    data: {
      assignee: assignedUser,
      title: data.title,
      description: data.description,
      points: data.points,
      link: data.link,
    },
  });

  return { status: "success", task: updatedTask };
}

export async function claimTask(taskId: number, userId: number) {
  const payload = await getPayload({ config });

  const task = await payload.findByID({
    collection: "tasks",
    id: taskId,
  });

  if (!task) return { status: "error", message: "Task not found" };
  if (task.status !== "available")
    return { status: "error", message: "Task not available for claiming." };

  const user = await payload.findByID({
    collection: "users",
    id: userId,
  });

  if (!user) return { status: "error", message: "User not found" };
  const claimedTask = await payload.update({
    collection: "tasks",
    where: {
      id: {
        equals: task.id,
      },
    },
    data: {
      status: "in-progress",
      assignee: user,
      assignedBy: user,
    },
  });

  return claimedTask;
}

export async function completeTask(taskId: number, userId: number) {
  const payload = await getPayload({ config });

  const task = await payload.findByID({
    collection: "tasks",
    id: taskId,
  });

  if (!task) return { status: "error", message: "Task not found" };
  if (task.status !== "in-progress" || !task.assignee)
    return { status: "error", message: "Task can't be completed." };

  const user = await payload.findByID({
    collection: "users",
    id: userId,
  });

  if (!user) return { status: "error", message: "User not found" };

  const assigneeId = getId(task.assignee);

  if (assigneeId.toString() !== user.id.toString())
    return {
      status: "error",
      message: "You're not assigned to you. You can't complete it.",
    };

  const completedTask = await payload.update({
    collection: "tasks",
    where: {
      id: {
        equals: task.id,
      },
    },
    data: {
      status: "completed",
      assignee: user,
    },
  });

  return completedTask;
}

export async function submitTaskForApproval(
  taskId: number,
  evidence: string,
  description?: string
) {
  const payload = await getPayload({ config });

  const usr = await getUser();

  if (!usr || !usr.member)
    return { status: "error", errors: "User is required" };

  const task = await payload.findByID({
    collection: "tasks",
    id: taskId,
  });

  if (!task) return { status: "error", message: "Task not found" };
  if (!task.isRecurring && (task.status !== "completed" || !task.assignee))
    return { status: "error", message: "Task can't be approved." };

  const user = await payload.findByID({
    collection: "users",
    id: usr.member?.id,
  });

  if (!user) return { status: "error", message: "User not found" };

  const assigneeId = getId(user);

  if (!task.isRecurring && assigneeId.toString() !== user.id.toString())
    return {
      status: "error",
      message: "You're not assigned to you. You can't submit it for approval.",
    };

  const sprint = await getCurrentSprint();

  if (task.isRecurring) {
    const createdTask = await payload.create({
      collection: "tasks",
      data: {
        ...task,
        assignee: user,
        status: "pending-approval",
        isRecurring: false,
        sprint,
      },
    });

    const request = await payload.create({
      collection: "requests",
      data: {
        task: createdTask,
        requestBy: user,
        status: "requested",
        title: task.title,
        description: description,
        points: task.points,
        evidence: evidence,
      },
    });

    return { status: "success", task: createdTask, request };
  } else {
    const request = await payload.create({
      collection: "requests",
      data: {
        task: task,
        requestBy: user,
        status: "requested",
        title: task.title,
        description: description,
        points: task.points,
        evidence: evidence,
      },
    });

    const pendingTask = await payload.update({
      collection: "tasks",
      where: {
        id: {
          equals: task.id,
        },
      },
      data: {
        status: "pending-approval",
        assignee: user,
      },
    });
    return { task: pendingTask, request: request };
  }
}

export async function removeTask(taskId: number, userId: number) {
  const payload = await getPayload({ config });

  try {
    const del = await payload.delete({
      collection: "tasks",
      id: taskId,
    });

    return { status: "success" };
  } catch (err) {
    console.error("err", err);
  }
}
