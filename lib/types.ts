import { Activity, Pod, Sprint } from "@/payload-types";

export type PodWithCount = Pod & { memberCount: number };
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
