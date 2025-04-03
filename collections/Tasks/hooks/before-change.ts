import { getCurrentSprint } from "@/actions/sprints";
import { Task } from "@/payload-types";
import { CollectionBeforeChangeHook } from "payload";

export const beforeTaskChange: CollectionBeforeChangeHook<Task> = async ({
  operation,
  originalDoc,
  data,
  req,
}) => {
  if (!originalDoc || data.isRecurring) return;

  //// handle status change
  if (originalDoc.status !== data.status && data.status === "approved") {
    const sprint = await getCurrentSprint();
    data.sprint = sprint?.id;
  }

  return data;
};
