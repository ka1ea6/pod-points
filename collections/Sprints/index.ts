import { DAY } from "@/lib/constants";
import type { CollectionConfig } from "payload";
import { afterSprintChange } from "./hooks/after-change";

export const Sprints: CollectionConfig = {
  slug: "sprints",
  admin: {
    useAsTitle: "title",
  },
  hooks: {
    afterChange: [afterSprintChange],
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
      // validate: (value, { previousValue, operation, siblingData }) => {
      //   if (!value) return "Value is required";
      //   const today = Date.now();
      //   const valueTime = new Date(value).getTime();
      //   const deadline = new Date(siblingData.deadline).getTime();

      //   if (previousValue) {
      //     const prevTime = new Date(previousValue).getTime();
      //     if (prevTime === valueTime) return true;
      //   }

      //   if (deadline && valueTime > deadline)
      //     return "Start date must be before deadline";
      //   if (
      //     today > valueTime &&
      //     (operation === "create" ||
      //       (operation === "update" && !siblingData.isActive))
      //   )
      //     return "Start date must be in the future";
      //   return true;
      // },
    },
    {
      name: "deadline",
      type: "date",
      required: true,
      // validate: (value, { siblingData }) => {
      //   if (!value) return "Value is required";
      //   const yesterday = Date.now() - DAY;
      //   const valueTime = new Date(value).getTime();
      //   const startTime = new Date((siblingData as any).startDate).getTime();
      //   if (yesterday > valueTime) return "Deadline must be in the future";
      //   if (startTime > valueTime) return "Deadline must be after start date";
      //   return true;
      // },
    },
  ],
};
