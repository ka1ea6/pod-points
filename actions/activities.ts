"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { ActivityWithReactionAndCommentCount } from "@/lib/types";

export async function getAllUserActivities(userId: number) {
  const payload = await getPayload({ config });

  const activities = await payload.find({
    collection: "activities",
    depth: 2,
  });

  const activitiesWithStats: ActivityWithReactionAndCommentCount[] =
    await Promise.all(
      activities.docs.map(async (activity) => {
        const reactions = await payload.find({
          collection: "activityReactions",
          where: {
            "activity.id": {
              equals: activity.id,
            },
          },
        });

        const commentCount = await payload.count({
          collection: "activityComments",
          where: {
            "activity.id": {
              equals: activity.id,
            },
          },
        });

        const likes = reactions.docs.filter((el) => el.reaction === "like");
        const hearts = reactions.docs.filter((el) => el.reaction === "heart");

        return {
          ...activity,
          reactions: {
            like: {
              userLiked:
                likes.filter((el) =>
                  typeof el.user === "number"
                    ? el.user === userId
                    : el.user.id === userId
                ).length > 0
                  ? true
                  : false,
              count: likes.length,
            },
            heart: {
              userLiked:
                hearts.filter((el) =>
                  typeof el.user === "number"
                    ? el.user === userId
                    : el.user.id === userId
                ).length > 0
                  ? true
                  : false,
              count: hearts.length,
            },
          },
          commentCount: commentCount.totalDocs,
        };
      })
    );

  if (activitiesWithStats) return { activities: activitiesWithStats };

  return { activities: null };
}
