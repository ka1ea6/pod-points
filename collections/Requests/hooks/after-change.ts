import { getId } from "@/lib/utils";
import { websocket } from "@/services";
import { CollectionAfterChangeHook } from "payload";

export const afterRequestChange: CollectionAfterChangeHook = async ({
  operation,
  doc,
  req,
}) => {
  const socket = websocket.getIO();

  socket?.emit("request", {
    doc,
    operation,
  });

  await req.payload.create({
    collection: "activities",
    data: {
      user: doc.requestBy,
      title: doc.title,
      action: doc.status,
      points: doc.points,
      description: doc.description,
    },
  });

  if (doc.status === "requested" && operation === "create") {
    const leads = await req.payload.find({
      collection: "users",
      where: {
        role: {
          equals: "lead",
        },
      },
    });

    await Promise.all(
      leads.docs.map(async (lead) => {
        await req.payload.create({
          collection: "notifications",
          data: {
            addressedTo: lead,
            title: "Request for approval",
            description: `${doc.requestBy.name} Requested approval for ${doc.title}`,
          },
        });
      })
    );
  }

  if (doc.status === "approved" && doc.task) {
    const taskId = getId(doc.task);
    const task = await req.payload.update({
      collection: "tasks",
      id: taskId,
      data: {
        status: "approved",
      },
    });

    if (task.assignedBy) {
      await req.payload.create({
        collection: "notifications",
        data: {
          addressedTo: task.assignedBy,
          title: "Request approval",
          description: `${req.user?.name} approved request ${doc.title}`,
        },
      });
    }

    if (task.assignee) {
      await req.payload.create({
        collection: "notifications",
        data: {
          addressedTo: task.assignee,
          title: "Request approval",
          description: `${req.user?.name} approved request ${doc.title}`,
        },
      });
    }
  }
};
