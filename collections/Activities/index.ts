import type { CollectionConfig } from "payload";
import { afterActivityChange } from "./hooks/after-change";

export const Activities: CollectionConfig = {
  slug: "activities",
  hooks: {
    afterChange: [afterActivityChange],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "action",
      type: "select",
      options: [
        { label: "Got Assigned", value: "got-assigned" },
        { label: "Completed", value: "completed" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
        { label: "Requested", value: "requested" },
      ],
      required: false,
    },
    {
      name: "title",
      type: "text",
    },
    {
      name: "description",
      type: "text",
    },
    {
      name: "points",
      type: "number",
    },
  ],
};
