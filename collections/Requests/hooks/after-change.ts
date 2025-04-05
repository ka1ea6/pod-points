import { getUser } from "@/actions/users";
import { getId } from "@/lib/utils";
import { Activity, Request } from "@/payload-types";
import { websocket } from "@/services";
import { CollectionAfterChangeHook } from "payload";

export const afterRequestChange: CollectionAfterChangeHook<Request> = async ({
  operation,
  doc,
  req,
}) => {
  const socket = websocket.getIO();

  const { member: user } = await getUser();

  // const {
  //   docs: [requester],
  // } = await req.payload.find({
  //   collection: "users",
  //   where: {
  //     id: {
  //       equals: doc.requestBy.id,
  //     },
  //   },
  // });

  if (!user) return;

  socket?.emit("request", {
    doc,
    operation,
  });

  let activity: Partial<Activity> = {
    user: user.id,
    action: doc.status,
    points: doc.points,
  };

  if (doc.status === "requested") {
    activity.title = `Request approval query`;
    activity.description = `${user?.name} Requested approval for ${doc.title}.`;
  } else if (doc.status === "approved") {
    activity.title = `Request Approval`;
    activity.description = `${user?.name} approved request ${doc.title} from ${doc.requestBy.name}`;
  } else {
    activity.title = `Request Rejection`;
    activity.description = `${user?.name} rejected request ${doc.title} from ${doc.requestBy.name}`;
  }
  await req.payload.create({
    collection: "activities",
    data: {
      // user: doc.requestBy,
      // user: user.id,
      // title: `Request approval`,
      // action: doc.status,
      // points: doc.points,
      // description: `${user?.name} approved request ${doc.title} from ${doc.requestBy.name}`,
      ...activity,
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

  if (doc.task && (doc.status === "approved" || doc.status === "rejected")) {
    const taskId = getId(doc.task);

    const task = await req.payload.update({
      collection: "tasks",
      id: taskId,
      data: {
        status: doc.status === "approved" ? "approved" : "in-progress",
      },
    });

    if (task.assignedBy) {
      await req.payload.create({
        collection: "notifications",
        data: {
          addressedTo: task.assignedBy,
          title:
            doc.status === "approved"
              ? "Request approval"
              : "Request Rejection",
          description: `${user?.name} ${doc.status === "approved" ? "approved" : "rejected"} request ${doc.title}`,
        },
      });
    }

    if (task.assignee) {
      await req.payload.create({
        collection: "notifications",
        data: {
          addressedTo: task.assignee,
          title:
            doc.status === "approved"
              ? "Request approval"
              : "Request Rejection",
          description: `${user?.name} ${doc.status === "approved" ? "approved" : "rejected"} request ${doc.title}`,
        },
      });
    }
  }
};
