"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";
import { Pod, User } from "@/payload-types";
import { generateRandomPassword } from "@/lib/random-password-generator";
import { cookies, headers } from "next/headers";
import { getId, sanitizeResponse } from "@/lib/utils";

const createMemberSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().min(1, { message: "Email is required." }),
  pod: z.string().optional(),
});

export async function createMember(prevState: any, formData: FormData) {
  const formEntry = Object.fromEntries(formData);
  const { success, data, error } = createMemberSchema.safeParse(formEntry);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      data: formEntry,
    };
  }

  const payload = await getPayload({ config });

  try {
    let pod: Pod | null = null;

    if (data.pod) {
      pod = await payload.findByID({
        collection: "pods",
        id: data.pod,
      });
    }

    const password = generateRandomPassword(12);

    const member = await payload.create({
      collection: "users",
      data: {
        ...data,
        pod,
        password,
        role: "member",
      },
    });

    return { member, password, status: "success" };
  } catch (err) {
    console.error("Error", err);
  }
}

export async function changeMemberPod(userId: number, podId: number) {
  const payload = await getPayload({ config });

  const updatedMember = await payload.update({
    collection: "users",
    id: userId,
    data: {
      pod: podId,
    },
  });

  return { member: updatedMember };
}

export async function awardPoints(userId: number, points: number) {
  const payload = await getPayload({ config });

  const user = await payload.findByID({
    collection: "users",
    id: userId,
  });

  const updatedMember = await payload.update({
    collection: "users",
    id: userId,
    data: {
      totalPoints: (user.totalPoints || 0) + points,
    },
  });

  return { member: updatedMember, status: "success" };
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const payload = await getPayload({ config });

  if (!email || !password) {
    return {
      status: "error",
      errors: {
        email: ["Email is required."],
        password: ["Password is required."],
      },
    };
  }

  const user = await payload.login({
    collection: "users",
    data: {
      email,
      password,
    },
  });

  // Set the cookie manually using Next.js cookies API
  const cookieStore = await cookies();
  if (user.token)
    cookieStore.set(`payload-token`, user.token, {
      httpOnly: true, // Secure the cookie
      secure: process.env.NODE_ENV === "production", // Only secure in production
      path: "/", // Accessible across the app
      maxAge: 7200, // Match Payload's default expiration (2 hours in seconds)
    });

  return {
    success: true,
    message: "Logged in successfully",
    user: user.user,
  };

  return { user };
}

export async function getUser() {
  const payload = await getPayload({ config });

  const heads = await headers();

  const member = await payload.auth({ headers: heads });

  return { member: sanitizeResponse<User>(member.user), status: "success" };
}

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

export async function getPodMembers() {
  const { member: user } = await getUser();

  if (!user) return { status: "error", error: "User not found" };

  const payload = await getPayload({ config });

  if (!user.pod) return { status: "success", members: [] };

  const podId = getId(user.pod);

  const { docs: users } = await payload.find({
    collection: "users",
    where: {
      "pod.id": {
        equals: podId,
      },
    },
  });

  const usersWithTaskCount = await Promise.all(
    users.map(async (user) => {
      const { docs: userTasks } = await payload.find({
        collection: "tasks",
        where: {
          "assignee.id": {
            equals: user.id,
          },
        },
      });

      return {
        ...user,
        tasks: {
          "in-progress": userTasks.filter((el) => el.status === "in-progress")
            .length,
          completed: userTasks.filter((el) => el.status === "completed").length,
          "pending-approval": userTasks.filter(
            (el) => el.status === "pending-approval"
          ).length,
          approved: userTasks.filter((el) => el.status === "approved").length,
        },
      };
    })
  );

  return { status: "success", members: usersWithTaskCount };
}
