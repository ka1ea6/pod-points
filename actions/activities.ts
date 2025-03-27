"use server";

import { getPayload } from "payload";
import config from "@/payload.config";

export async function getAllActivities() {
  const payload = await getPayload({ config });

  const activities = await payload.find({
    collection: "activities",
    depth: 2,
  });

  if (activities) return { activities };

  return { activities: null };
}
