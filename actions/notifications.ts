"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";

export async function markAllAsRead() {
  const payload = await getPayload({ config });

  const user = await getCurrentUser();

  if (!user) return { status: "error", error: "User is required" };

  await payload.update({
    collection: "notifications",
    where: {
      "addressedTo.id": {
        equals: user.id,
      },
    },
    data: {
      seen: true,
    },
  });
}

export async function getUserNotifications(userId: number) {
  const payload = await getPayload({ config });

  const notifications = await payload.find({
    collection: "notifications",
    where: {
      and: [
        {
          "addressedTo.id": {
            equals: userId,
          },
        },
        {
          seen: {
            equals: false,
          },
        },
      ],
    },
  });

  return { notifications, status: "success" };
}
