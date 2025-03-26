import type { CollectionConfig } from "payload";

export const Tasks: CollectionConfig = {
  slug: "tasks",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "text",
      required: false,
    },
    {
      name: "link",
      type: "text",
      required: false,
    },
    {
      name: "points",
      type: "number",
      required: true,
      defaultValue: 0,
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "To Do", value: "available" },
        { label: "In Progress", value: "in-progress" },
        { label: "Completed", value: "completed" },
        { label: "Approved", value: "approved" },
      ],
      defaultValue: "available",
      required: true,
    },
    {
      name: "assignee",
      type: "relationship",
      relationTo: "users",
    },
    {
      name: "assignedBy",
      type: "relationship",
      relationTo: "users",
    },
    // we'll have a sprint field to keep track of the sprints
    {
      name: "sprint",
      type: "relationship",
      relationTo: "sprints",
      // required: true,
    },
  ],
};
