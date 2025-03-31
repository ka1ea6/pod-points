import type { CollectionConfig } from "payload";
import { afterRequestChange } from "./hooks/after-change";

export const Requests: CollectionConfig = {
  slug: "requests",
  hooks: {
    afterChange: [afterRequestChange],
  },
  fields: [
    {
      name: "requestBy",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "actionBy",
      type: "relationship",
      relationTo: "users",
      required: false,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "requested",
      options: [
        { label: "Requested", value: "requested" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ],
      required: true,
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "points",
      type: "number",
      required: true,
    },
    {
      name: "evidence",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "text",
    },
  ],
};
