import { getId } from "@/lib/utils";
import { Task } from "@/payload-types";
import { websocket } from "@/services";
import { CollectionAfterChangeHook } from "payload";

export const afterTaskChange: CollectionAfterChangeHook<Task> = async ({
  collection,
  doc,
  previousDoc,
  operation,
  req,
}) => {
  const io = websocket.getIO();

  const currAssignee = doc.assignee ? getId(doc.assignee) : null;
  const prevAssignee = previousDoc.assignee
    ? getId(previousDoc.assignee)
    : null;

  if (prevAssignee && (!currAssignee || currAssignee !== prevAssignee)) {
    await req.payload.create({
      collection: "notifications",
      data: {
        addressedTo: parseInt(prevAssignee.toString()),
        title: "Task reassignment",
        description: `You have been removed from task ${doc.title}.`,
      },
    });
  }

  if (currAssignee) {
    if (!prevAssignee || currAssignee !== prevAssignee) {
      if (currAssignee)
        await req.payload.create({
          collection: "notifications",
          data: {
            addressedTo: parseInt(currAssignee.toString()),
            title: "Task assignment",
            description: `You have been assigned to task ${doc.title}.`,
          },
        });
    }
  }

  io?.emit(`tasks`, {
    operation,
    doc,
  });
};
