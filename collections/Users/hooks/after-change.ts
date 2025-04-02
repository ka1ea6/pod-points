import { User } from "@/payload-types";
import { websocket } from "@/services";
import { CollectionAfterChangeHook } from "payload";

export const afterUserChange: CollectionAfterChangeHook<User> = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  const socket = websocket.getIO();

  socket?.emit("users", { doc, operation });

  if (operation === "update") {
    // pod change
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

    if (doc.totalPoints !== previousDoc.totalPoints) {
      socket?.emit("point-updated", { doc });
    }
  }
};
