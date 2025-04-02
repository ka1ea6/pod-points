import { getId } from "@/lib/utils";
import { websocket } from "@/services";
import { CollectionAfterChangeHook } from "payload";

export const afterNotificationChange: CollectionAfterChangeHook = ({
  doc,
  operation,
}) => {
  const socket = websocket.getIO();
  const addressedId = getId(doc.addressedTo);

  socket?.emit(`notifications/${addressedId}`, {
    doc,
    operation,
  });
};
