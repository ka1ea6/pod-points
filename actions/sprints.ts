"use server";

import { getPayload } from "payload";
import config from "@/payload.config";

export async function getCurrentSprint() {
  const payload = await getPayload({ config });

  const sprint = await payload.find({
    collection: "sprints",
    depth: 2,
    limit: 1,
    where: {
      isActive: {
        equals: true,
      },
    },
  });

  if (sprint.docs && sprint.docs.length > 0) return { sprint: sprint.docs[0] };

  return { sprint: null };
}
