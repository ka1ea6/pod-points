import { getId } from "@/lib/utils";
import { CollectionAfterChangeHook } from "payload";

export const afterRequestChange: CollectionAfterChangeHook = async ({
  operation,
  doc,
  req,
}) => {
  const res = await req.payload.create({
    collection: "activities",
    data: {
      user: doc.requestBy,
      title: doc.title,
      action: doc.status,
      points: doc.points,
      description: doc.description,
    },
  });

  if (doc.status === "approved" && doc.task) {
    const taskId = getId(doc.task);
    const task = await req.payload.update({
      collection: "tasks",
      id: taskId,
      data: {
        status: "approved",
      },
    });
  }
};
