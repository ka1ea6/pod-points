"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { SprintWithTaskCount } from "@/lib/types";
import { Sprint } from "@/payload-types";
import { z } from "zod";

const createSprintSchema = z.object({
  title: z.string(),
  description: z.string(),
  startDate: z.coerce.date({ message: "Start date is required." }),
  deadline: z.coerce.date({ message: "Deadline is required." }),
});

export async function createSprint(prevState: any, formData: FormData) {
  const formEntry = Object.fromEntries(formData);
  const { success, data, error } = createSprintSchema.safeParse(formEntry);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      data: formEntry,
    };
  }

  const payload = await getPayload({ config });

  const sprint = await payload.create({
    collection: "sprints",
    data: {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      deadline: new Date(data.deadline).toISOString(),
      isActive: false,
    },
  });

  return { status: "success", sprint };
}

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

export async function getAllSprints() {
  const payload = await getPayload({ config });

  const sprints = await payload.find({
    collection: "sprints",
    depth: 2,
  });

  const sprintWithCount: SprintWithTaskCount[] = await Promise.all(
    sprints.docs.map(async (sprint) => {
      const { totalDocs: count } = await payload.count({
        collection: "tasks",
        where: {
          "sprint.id": {
            equals: sprint.id,
          },
        },
      });

      return { ...sprint, taskCount: count };
    })
  );

  return { sprints: sprintWithCount, status: "success" };
}

export async function changeDateRange({
  sprintId,
  from,
  to,
}: {
  sprintId: number;
  from: Date;
  to: Date;
}) {
  const payload = await getPayload({ config });

  const updatedObj: Partial<Sprint> = {};

  if (from) updatedObj.startDate = from.toISOString();
  if (to) updatedObj.deadline = to.toISOString();

  const updatedSprint = await payload.update({
    collection: "sprints",
    id: sprintId,
    data: {
      ...updatedObj,
    },
  });

  return { sprint: updatedSprint, status: "success" };
}

export async function endSprint({
  userId,
  sprintId,
}: {
  userId: number;
  sprintId: number;
}) {
  const payload = await getPayload({ config });

  const sprint = await payload.update({
    collection: "sprints",
    id: sprintId,
    data: {
      deadline: new Date().toISOString(),
      isActive: false,
    },
  });

  return { sprint, status: "success" };
}

export async function activateSprint({
  userId,
  sprintId,
}: {
  userId: number;
  sprintId: number;
}) {
  const payload = await getPayload({ config });

  const activeSprint = await payload.update({
    collection: "sprints",
    where: {
      isActive: {
        equals: true,
      },
    },
    data: {
      isActive: false,
      deadline: new Date().toISOString(),
    },
  });

  if (activeSprint.docs && activeSprint.docs.length > 0) {
    await payload.update({
      collection: "tasks",
      where: {
        "sprint.id": {
          equals: activeSprint.docs[0].id,
        },
      },
      data: {
        sprint: sprintId,
      },
    });
  }

  const sprint = await payload.update({
    collection: "sprints",
    id: sprintId,
    data: {
      startDate: new Date().toISOString(),
      isActive: true,
    },
  });

  return { sprint, status: "success" };
}

export async function getOngoingSprintTasks(sprintId: number) {
  const payload = await getPayload({ config });

  const tasks = await payload.find({
    collection: "tasks",
    where: {
      and: [
        {
          "sprint.id": {
            equals: sprintId,
          },
        },
        {
          or: [
            {
              status: {
                equals: "in-progress",
              },
            },
            {
              status: {
                equals: "completed",
              },
            },
          ],
        },
      ],
    },
  });

  return { tasks, status: "success" };
}
