import { websocket } from "@/services";
import { CollectionAfterChangeHook } from "payload";

export const afterPodChange: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  const socket = websocket.getIO();
  if (operation === "create")
    socket?.emit("pods", { doc: { ...doc, memberCount: 0 }, operation });
  else {
    // waiting artificially for the user pod to be saved
    setTimeout(async () => {
      const { totalDocs: count } = await req.payload.count({
        collection: "users",
        where: {
          "pod.id": {
            equals: doc.id,
          },
        },
      });

      socket?.emit("pods", { doc: { ...doc, memberCount: count }, operation });
    }, 1000);
  }
};
