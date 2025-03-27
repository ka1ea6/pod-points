import { User } from "@/payload-types";
import { FieldHook, Where } from "payload";

export const BeforeMemberChange: FieldHook = async ({
  req,
  siblingData,
  originalDoc,
}) => {
  const memberIds = (siblingData.members || []).map((member: number | User) =>
    typeof member === "number" ? member : member.id
  );

  const whereQuery: Where = {
    and: [
      {
        "members.id": {
          in: memberIds,
        },
      },
    ],
  };

  if (siblingData.id && whereQuery.and) {
    whereQuery.and.push({
      id: {
        not_equals: siblingData.id,
      },
    });
  }

  const { docs } = await req.payload.find({
    collection: "pods",
    where: whereQuery,
  });

  if (docs.length > 0) {
    const { docs: users } = await req.payload.find({
      collection: "users",
      where: {
        and: [
          {
            id: {
              in: memberIds,
            },
          },
          {
            id: {
              not_in: (originalDoc.members || [])?.map(
                (member: number | User) =>
                  typeof member === "number" ? member : member.id
              ),
            },
          },
        ],
      },
    });
    req.payload.logger.error(
      `${(users || []).map((el) => el.name)} already in team`
    );
    return `${(users || []).map((el) => el.name).join(", ")} ${users.length > 1 ? "are" : "is"} already in another team`;
  }
};
