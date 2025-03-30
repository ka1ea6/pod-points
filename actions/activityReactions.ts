"use server";

import { ActivityReaction } from "@/payload-types";
import { getPayload } from "payload";
import config from "@payload-config";

export async function addActivityReaction({
  userId,
  activityId,
  reaction,
}: {
  userId: number;
  activityId: number;
  reaction: ActivityReaction["reaction"];
}) {
  const payload = await getPayload({ config });

  const { docs: currReactions } = await payload.find({
    collection: "activityReactions",
    where: {
      and: [
        {
          "user.id": {
            equals: userId,
          },
        },
        {
          "activity.id": {
            equals: activityId,
          },
        },
        {
          reaction: {
            equals: reaction,
          },
        },
      ],
    },
  });

  if (currReactions.length > 0) {
    const delReactions = await Promise.all(
      currReactions.map(async (reaction) => {
        const res = await payload.delete({
          collection: "activityReactions",
          id: reaction.id,
        });

        return res;
      })
    );

    return { reactions: delReactions, status: "success" };
  }
  const currReaction = await payload.create({
    collection: "activityReactions",
    data: {
      user: userId,
      activity: activityId,
      reaction,
    },
  });

  return { reaction: currReaction, status: "success" };
}
