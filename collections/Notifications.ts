import type { CollectionConfig } from "payload";

export const Notifications: CollectionConfig = {
  slug: "notifications",
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
      name: "addressedTo",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "link",
      type: "text",
      required: false,
    },
  ],
};
