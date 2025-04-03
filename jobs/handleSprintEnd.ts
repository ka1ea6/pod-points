import { getPayload } from "payload";
import config from "@payload-config";

export const handleSprintEnd = async () => {
  try {
    const payload = await getPayload({ config });

    const {
      docs: [sprint],
    } = await payload.find({
      collection: "sprints",
      where: {
        and: [
          {
            isActive: {
              equals: true,
            },
          },
          {
            deadline: {
              less_than_equal: new Date().toISOString(),
            },
          },
        ],
      },
    });

    if (sprint) {
      const res = await payload.update({
        collection: "sprints",
        id: sprint.id,
        data: {
          isActive: false,
        },
      });

      const { docs: users } = await payload.find({
        collection: "users",
      });

      const diff =
        (new Date(sprint.deadline).getTime() -
          new Date(sprint.startDate).getTime()) /
        (1000 * 60 * 60 * 24);

      Promise.all(
        users.map(async (el) => {
          await payload.create({
            collection: "notifications",
            data: {
              addressedTo: el.id,
              title: "Sprint ended",
              description: `Sprint ${sprint.title} ended after lasting for ${Math.floor(diff)} days`,
            },
          });
        })
      );
    }
  } catch (err) {
    console.error("error", err);
  }
};
