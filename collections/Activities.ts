import type { CollectionConfig } from "payload";

export const Activities: CollectionConfig = {
  slug: "activities",
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "task",
      type: "relationship",
      relationTo: "tasks",
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
      ],
      required: false,
    },
  ],
};
