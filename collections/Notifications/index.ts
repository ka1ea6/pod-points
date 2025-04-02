import type { CollectionConfig } from "payload";
import { afterNotificationChange } from "./hooks/after-change";

export const Notifications: CollectionConfig = {
  slug: "notifications",
  admin: {
    useAsTitle: "title",
  },
  hooks: {
    afterChange: [afterNotificationChange],
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
      name: "seen",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "link",
      type: "text",
      required: false,
    },
  ],
};
