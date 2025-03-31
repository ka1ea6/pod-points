"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

const createCommentSchema = z.object({
  userId: z.string().min(1, { message: "User is required." }),
  activityId: z.string().min(1, { message: "Activity is required." }),
  comment: z.string().min(1, { message: "Comment is required" }),
});

export async function addComment(prevState: any, formData: FormData) {
  const formEntry = Object.fromEntries(formData);
  const { success, data, error } = createCommentSchema.safeParse(formEntry);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      data: formEntry,
    };
  }

  const payload = await getPayload({ config });

  const user = await payload.findByID({
    collection: "users",
    id: data.userId,
  });

  if (!user) {
    return {
      errors: {
        userId: ["User not found"],
      },
      data: data,
    };
  }

  const activity = await payload.findByID({
    collection: "activities",
    id: data.activityId,
  });

  if (!activity) {
    return {
      errors: {
        activityId: ["Activity not found"],
      },
      data: data,
    };
  }

  const res = await payload.create({
    collection: "activityComments",
    data: {
      ...data,
      user,
      activity,
    },
  });

  return { comment: res, status: "success" };
}

export async function getActivityComments(activityId: number) {
  const payload = await getPayload({ config });

  const comments = await payload.find({
    collection: "activityComments",
    where: {
      "activity.id": {
        equals: activityId,
      },
    },
    sort: "createdAt",
  });

  return { comments };
}
