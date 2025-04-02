import { ActivityComment } from "@/payload-types";
import { websocket } from "@/services";
import { CollectionAfterChangeHook } from "payload";

export const afterActivityCommentChange: CollectionAfterChangeHook<
  ActivityComment
> = async ({ doc, operation }) => {
  const socket = websocket.getIO();

  socket?.emit("activity-comments", {
    doc,
    operation,
  });
};
