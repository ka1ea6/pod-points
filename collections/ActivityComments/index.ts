import type { CollectionConfig } from "payload";
import { afterActivityCommentChange } from "./hooks/after-change";

export const ActivityComments: CollectionConfig = {
  slug: "activityComments",
  hooks: {
    afterChange: [afterActivityCommentChange],
  },
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
