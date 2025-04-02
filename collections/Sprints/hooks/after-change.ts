import { websocket } from "@/services";
import { CollectionAfterChangeHook } from "payload";

export const afterSprintChange: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  const socket = websocket.getIO();

  const { totalDocs: count } = await req.payload.count({
    collection: "tasks",
    where: {
      "sprint.id": {
        equals: doc.id,
      },
    },
  });

  socket?.emit("sprints", {
    doc: { ...doc, taskCount: count },
    operation,
  });
};
