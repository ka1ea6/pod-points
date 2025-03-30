"use server";

import { getPayload } from "payload";
import config from "@payload-config";

export async function getActivityComments(activityId: number) {
  const payload = await getPayload({ config });

  const comments = await payload.find({
    collection: "activityComments",
    where: {
      "activity.id": {
        equals: activityId,
      },
    },
  });

  return { comments };
}
