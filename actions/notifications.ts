"use server";

import { getPayload } from "payload";
import config from "@payload-config";

export async function getUserNotifications(userId: number) {
  const payload = await getPayload({ config });

  const notifications = await payload.find({
    collection: "notifications",
    where: {
      // and: [
      //   {
      //     "addressedTo.id": {
      //       equals: userId,
      //     },
      //   },
      //   {
      //     seen: {
      //       equals: false,
      //     },
      //   },
      // ],
    },
  });

  return { notifications, status: "success" };
}
