import { CollectionAfterChangeHook } from "payload";

export const afterRequestChange: CollectionAfterChangeHook = async ({
  operation,
  doc,
  req,
}) => {
  if (operation === "create") {
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
  }
};
