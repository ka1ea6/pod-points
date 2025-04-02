import { getId } from "@/lib/utils";
import { ActivityComment } from "@/payload-types";
import { websocket } from "@/services";
import { CollectionAfterChangeHook } from "payload";

export const afterActivityCommentChange: CollectionAfterChangeHook<
  ActivityComment
> = async ({ doc, operation, req }) => {
  const socket = websocket.getIO();

  const activity = await req.payload.findByID({
    collection: "activities",
    id: typeof doc.activity === "number" ? doc.activity : doc.activity.id,
    depth: 3,
  });

  const userId = getId(doc.user);

  const user = await req.payload.findByID({
    collection: "users",
    id: userId,
  });

  if (
    activity &&
    activity.user &&
    activity.user?.id.toString() !== userId.toString()
  )
    await req.payload.create({
      collection: "notifications",
      data: {
        addressedTo: activity.user.id,
        title: "Comment added",
        description: `Comment added by ${user.name} on ${activity.title} ${activity.action}`,
      },
    });

  socket?.emit("activity-comments", {
    doc,
    operation,
  });
};
