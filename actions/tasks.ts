"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { Task } from "@/payload-types";

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
