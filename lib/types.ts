import { Activity, Pod, Sprint, Task, User } from "@/payload-types";

export type UserWithTaskCount = User & {
  tasks: Record<
    "in-progress" | "completed" | "pending-approval" | "approved",
    number
  >;
};
export type PodWithCount = Pod & { memberCount: number };
export type SprintStats = PodWithCount & { points: number };
export type SprintWithTaskCount = Sprint & { taskCount: number };
export type ActivityWithReactionAndCommentCount = Activity & {
  reactions: {
    like: {
      userLiked: boolean;
      count: number;
    };
    heart: {
      userLiked: boolean;
      count: number;
    };
  };
  commentCount: number;
};

export type SocketArgs<T> = { doc: T; operation: "create" | "update" };
