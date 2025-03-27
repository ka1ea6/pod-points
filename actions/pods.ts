"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { Pod } from "@/payload-types";
import { PodWithCount } from "@/lib/types";

export async function getAllPods() {
  const payload = await getPayload({ config });

  const pods = await payload.find({
    collection: "pods",
    depth: 2,
  });

  const podWithMemberCount: PodWithCount[] = await Promise.all(
    pods.docs.map(async (pod: Pod) => {
      const { totalDocs: count } = await payload.count({
        collection: "users",
        where: {
          "pod.id": {
            equals: pod.id,
          },
        },
      });

      return { ...pod, memberCount: count };
    })
  );
  return { pods: podWithMemberCount, length: pods.totalDocs };
}

export async function getPodMemberCount(podId: number) {
  const payload = await getPayload({ config });

  const count = await payload.count({
    collection: "users",
    where: {
      "pod.id": {
        equals: podId,
      },
    },
  });

  return count;
}
