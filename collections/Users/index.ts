import type { CollectionConfig } from "payload";
import { afterUserChange } from "./hooks/after-change";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
  },
  hooks: {
    afterChange: [afterUserChange],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    // We can store lifetime points in the user document
    {
      name: "totalPoints",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "role",
      type: "select",
      options: [
        {
          label: "Member",
          value: "member",
        },
        {
          label: "Lead",
          value: "lead",
        },
      ],
      // defaultValue: "member",
    },
    {
      name: "pod",
      type: "relationship",
      relationTo: "pods",
      required: false,
      hasMany: false,
      admin: {
        allowCreate: false,
      },
    },
  ],
};
