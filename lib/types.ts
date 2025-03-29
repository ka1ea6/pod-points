import { Pod, Sprint } from "@/payload-types";

export type PodWithCount = Pod & { memberCount: number };
export type SprintWithTaskCount = Sprint & { taskCount: number };
