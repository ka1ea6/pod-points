import type { CollectionConfig } from "payload";

export const ActivityComments: CollectionConfig = {
  slug: "activityComments",
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "activity",
      type: "relationship",
      relationTo: "activities",
      required: true,
      hasMany: false,
    },
    {
      name: "comment",
      type: "textarea",
      required: true,
    },
  ],
};
