import { Activity } from "@/payload-types";
import { websocket } from "@/services";
import { CollectionAfterChangeHook } from "payload";

export const afterActivityChange: CollectionAfterChangeHook<Activity> = async ({
  operation,
  doc,
}) => {
  const socket = websocket.getIO();

  socket?.emit("activity", {
    doc,
    operation,
  });
};
