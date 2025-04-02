"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";
import { Request } from "@/payload-types";
import { getId } from "@/lib/utils";

const createRequestSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  points: z.coerce.number(),
  description: z.string().optional(),
  requestBy: z.string().min(1, {
    message: "There must be a logged in user requesting the points.",
  }),
  evidence: z.string().min(1, { message: "Evidence is required" }),
});

export async function createRequest(prevState: any, formData: FormData) {
  const formEntry = Object.fromEntries(formData);
  const { success, data, error } = createRequestSchema.safeParse(formEntry);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      data: formEntry,
    };
  }

  const payload = await getPayload({ config });

  try {
    const requestBy = await payload.findByID({
      collection: "users",
      id: data.requestBy,
    });

    const task = await payload.create({
      collection: "tasks",
      data: {
        ...data,
        isRecurring: false,
        assignee: requestBy,
        status: "pending-approval",
      },
    });
    const request = await payload.create({
      collection: "requests",
      data: {
        ...data,
        status: "requested",
        requestBy: requestBy,
        task,
      },
    });

    return { status: "success", request };
  } catch (err) {
    console.error("err", err);
  }
}

export async function changeRequestStatus(
  requestId: number,
  userId: number,
  status: Request["status"]
) {
  const payload = await getPayload({ config });

  const request = await payload.update({
    collection: "requests",
    id: requestId,
    data: {
      status,
      actionBy: userId,
    },
  });

  if (request.task) {
    const taskId = getId(request.task);
    const task = await payload.update({
      collection: "tasks",
      id: taskId,
      data: {
        status: "approved",
      },
    });

    return { request, task, status: "success" };
  }

  return { request, status: "success" };
}

export async function getPendingRequests() {
  const payload = await getPayload({ config });

  const requests = await payload.find({
    collection: "requests",
    depth: 3,
    where: {
      status: {
        equals: "requested",
      },
    },
  });

  return { status: "success", requests: requests.docs };
}
