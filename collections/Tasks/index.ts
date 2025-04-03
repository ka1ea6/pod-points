import type { CollectionConfig } from "payload";
import { afterTaskChange } from "./hooks/after-change";
import { beforeTaskChange } from "./hooks/before-change";

export const Tasks: CollectionConfig = {
  slug: "tasks",
  admin: {
    useAsTitle: "title",
  },
  hooks: {
    afterChange: [afterTaskChange],
    beforeChange: [beforeTaskChange],
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
        { label: "Pending approval", value: "pending-approval" },
        { label: "Approved", value: "approved" },
      ],
      defaultValue: "available",
      required: true,
      admin: {
        condition: (_, siblingData: any) => !siblingData.isRecurring,
      },
    },
    {
      name: "assignee",
      type: "relationship",
      relationTo: "users",
      admin: {
        condition: (_, siblingData: any) => !siblingData.isRecurring,
      },
    },
    {
      name: "assignedBy",
      type: "relationship",
      relationTo: "users",
      admin: {
        condition: (_, siblingData: any) => !siblingData.isRecurring,
      },
    },
    {
      name: "isRecurring",
      type: "checkbox",
      admin: {
        position: "sidebar",
      },
      defaultValue: false,
    },
    {
      name: "fromRecurring",
      type: "checkbox",
      admin: {
        description:
          "Field to signify wether task was copied from recurring task",
        position: "sidebar",
      },
      defaultValue: false,
    },
    {
      name: "sprint",
      type: "relationship",
      relationTo: "sprints",
      admin: {
        position: "sidebar",
        condition: (_, siblingData) => {
          return !siblingData.isRecurring;
        },
      },
      // required: true,
    },
  ],
};
