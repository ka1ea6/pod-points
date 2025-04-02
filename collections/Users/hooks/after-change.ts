import { websocket } from "@/services";
import { CollectionAfterChangeHook } from "payload";

export const afterUserChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  const socket = websocket.getIO();

  socket?.emit("users", { doc, operation });

  if (operation === "update") {
    if (doc.pod !== previousDoc.pod) {
      await req.payload.create({
        collection: "notifications",
        data: {
          addressedTo: doc.id,
          title: "Pod assignment",
          description: `You've been assigned to pod ${doc.pod?.name}`,
          link: "",
        },
      });
    }
  }
};
