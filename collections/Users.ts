import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
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
    },
  ],
};
