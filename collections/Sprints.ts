import type { CollectionConfig } from "payload";

export const Sprints: CollectionConfig = {
  slug: "sprints",
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
      name: "isActive",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "startDate",
      type: "date",
      // defaultValue: new Date(),
      required: true,
      validate: (value) => {
        if (!value) return "Value is required";
        const today = Date.now();
        const valueTime = new Date(value).getTime();
        if (today > valueTime) return "Start date must be in the future";
        return true;
      },
    },
    {
      name: "deadline",
      type: "date",
      required: true,
      validate: (value, { siblingData }) => {
        if (!value) return "Value is required";
        const today = Date.now();
        const valueTime = new Date(value).getTime();
        const startTime = new Date((siblingData as any).startDate).getTime();
        if (today > valueTime) return "Deadline must be in the future";
        if (startTime > valueTime) return "Deadline must be after start date";
        return true;
      },
    },
  ],
};
