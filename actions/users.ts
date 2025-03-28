"use server";

import { getPayload } from "payload";
import config from "@payload-config";

export async function getAllMembers() {
  const payload = await getPayload({ config });

  const members = await payload.find({
    collection: "users",
    depth: 2,
    where: {
      role: {
        equals: "member",
      },
    },
  });

  return { members };
}
