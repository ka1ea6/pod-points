import type { CollectionConfig } from "payload";

export const Teams: CollectionConfig = {
  slug: "teams",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    // Will change to a color field
    // Each team should have a unique color
    {
      name: "color",
      type: "text",
      unique: true,
    },
    {
      name: "members",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
    },
  ],
};
