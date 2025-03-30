import type { CollectionConfig } from "payload";

export const ActivityReactions: CollectionConfig = {
  slug: "activityReactions",
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "activity",
      type: "relationship",
      relationTo: "activities",
      required: true,
    },
    {
      name: "reaction",
      type: "select",
      options: [
        { label: "👍", value: "like" },
        { label: "❤️", value: "heart" },
      ],
    },
  ],
};
