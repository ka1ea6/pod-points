import type { CollectionConfig } from "payload";
import { colorPickerField } from "@innovixx/payload-color-picker-field";
import { BeforeMemberChange } from "./hooks/before-member-change";
import { afterPodChange } from "./hooks/after-pod-change";

export const Pods: CollectionConfig = {
  slug: "pods",
  admin: {
    useAsTitle: "name",
  },
  hooks: {
    afterChange: [afterPodChange],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "points",
      type: "number",
      required: true,
      defaultValue: 0,
    },
    // Will change to a color field
    // Each team should have a unique color
    colorPickerField({
      name: "color",
      label: "Color",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
        description: "Choose a color for this page",
      },
    }),
    // {
    //   name: "color",
    //   type: "text",
    //   unique: true,
    // },
    // {
    //   name: "members",
    //   type: "relationship",
    //   relationTo: "users",
    //   hasMany: true,
    //   hooks: {
    //     beforeChange: [BeforeMemberChange],
    //   },
    // },
  ],
};
