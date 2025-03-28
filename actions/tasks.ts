"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { Task, User } from "@/payload-types";
import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  link: z.string(),
  points: z.coerce.number(),
  assignee: z.string().optional(),
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

    const newTask = await payload.create({
      collection: "tasks",
      data: {
        ...data,
        assignee: assignedUser,
        status: "available",
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
