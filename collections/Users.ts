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
  ],
};
