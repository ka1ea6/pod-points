"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { Pod } from "@/payload-types";
import { PodWithCount } from "@/lib/types";
import { z } from "zod";

const createPodSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  color: z.string().min(1, { message: "Color is required" }),
});

export async function createPod(prevState: any, formData: FormData) {
  const formEntry = Object.fromEntries(formData);
  const { success, data, error } = createPodSchema.safeParse(formEntry);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      data: formEntry,
    };
  }

  const payload = await getPayload({ config });

  try {
    const newPod = await payload.create({
      collection: "pods",
      data: {
        ...data,
        points: 0,
      },
    });
    return { status: "success", pod: newPod };
  } catch (err) {
    console.error("err", err);
    if ((err as any).rawCode === 2067) {
      return {
        errors: {
          color: ["Color must be unique"],
        },
      };
    }
  }
}

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

export async function getMembersNotInPod(podId: number) {
  const payload = await getPayload({ config });

  const members = await payload.find({
    collection: "users",
    where: {
      and: [
        {
          "pod.id": {
            not_equals: podId,
          },
        },
        {
          role: {
            equals: "member",
          },
        },
      ],
    },
  });

  return members;
}

export async function getPodMembers(podId: number) {
  const payload = await getPayload({ config });

  const members = await payload.find({
    collection: "users",
    where: {
      and: [
        {
          "pod.id": {
            equals: podId,
          },
        },
        {
          role: {
            equals: "member",
          },
        },
      ],
    },
  });

  return members;
}

const editPodSchema = z.object({
  podId: z.string().min(1, { message: "Pod ID is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  color: z.string().min(1, { message: "Color is required." }),
  members: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return val; // If parsing fails, let Zod handle the validation error
      }
    }
    return val;
  }, z.array(z.string())),
});

export async function editPod(prevState: any, formData: FormData) {
  const formEntry = Object.fromEntries(formData);
  const { success, data, error } = editPodSchema.safeParse(formEntry);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      data: formEntry,
    };
  }

  const payload = await getPayload({ config });

  try {
    const updatedPod = await payload.update({
      collection: "pods",
      id: data.podId,
      data: {
        name: data.name,
        color: data.color,
        points: 0,
      },
    });

    const updatedUsers = await payload.update({
      collection: "users",
      where: {
        id: {
          in: data.members,
        },
      },
      data: {
        pod: updatedPod,
      },
    });

    return { status: "success", pod: updatedPod, users: updatedUsers.docs };
  } catch (err) {
    console.error("err", err);
    if ((err as any).rawCode === 2067) {
      return {
        errors: {
          color: ["Color must be unique"],
        },
      };
    }

    return {
      formError: "Error saving form",
    };
  }
}
