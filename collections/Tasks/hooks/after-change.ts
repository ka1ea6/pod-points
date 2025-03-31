import { websocket } from "@/services";
import { CollectionAfterChangeHook } from "payload";

export const afterTaskChange: CollectionAfterChangeHook = ({
  collection,
  doc,
  operation,
}) => {
  const io = websocket.getIO();

  io?.emit(`tasks`, {
    operation,
    doc,
  });
};
