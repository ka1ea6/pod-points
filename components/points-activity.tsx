"use client";

import { use, useActionState, useCallback, useEffect, useState } from "react";
import { add, formatDistanceToNow } from "date-fns";
import { Dot, Heart, MessageSquare, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityComment, ActivityReaction, User } from "@/payload-types";
import { getAllUserActivities } from "@/actions/activities";
import { ActivityWithReactionAndCommentCount } from "@/lib/types";
import { cn } from "@/lib/utils";
import { addActivityReaction } from "@/actions/activityReactions";
import { addComment, getActivityComments } from "@/actions/activityComments";
import { formatDate } from "@/lib/formatters";
import { Input } from "./ui/input";
import { toast } from "sonner";

export function PointsActivity() {
  const [state, formAction] = useActionState(addComment, {} as any);
  const [activities, setActivities] = useState<
    ActivityWithReactionAndCommentCount[]
  >([]);

  const [comments, setComments] = useState<Record<number, ActivityComment[]>>(
    {}
  );

  const fetchActivities = useCallback(async () => {
    const res = await getAllUserActivities(1);
    if (res && res.activities) setActivities(res.activities);
  }, []);

  const fetchActivityComments = useCallback(async (activityId: number) => {
    const res = await getActivityComments(activityId);
    setComments((prev) => {
      const copy = { ...prev };

      if (res.comments.docs && res.comments.docs.length > 0) {
        copy[activityId] = res.comments.docs;
      }

      return copy;
    });
  }, []);

  useEffect(() => {
    if (state && state.status === "success") {
      toast.success("Comment added");
    }
  }, [state]);

  const addReaction = useCallback(
    async (activityId: number, reaction: ActivityReaction["reaction"]) => {
      if (!reaction) return;
      setActivities((prev) => {
        const copy = [...prev];
        const mapped = copy.map((el) => {
          if (el.id.toString() !== activityId.toString()) return el;

          el.reactions[reaction].userLiked = !el.reactions[reaction].userLiked;
          el.reactions[reaction].count = el.reactions[reaction].userLiked
            ? el.reactions[reaction].count + 1
            : el.reactions[reaction].count - 1;

          return el;
        });

        return mapped;
      });
      const res = await addActivityReaction({
        activityId,
        userId: 1,
        reaction,
      });
    },
    []
  );

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>See what your team has been up to</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const user = activity.user as User;
            return (
              <div className="flex flex-col">
                <div key={activity.id} className="flex gap-3">
                  <Avatar
                    className="h-8 w-8 border-2"
                    style={{
                      borderColor:
                        typeof user.pod === "number" ? "#ddd" : user.pod?.color,
                    }}
                  >
                    <AvatarImage
                      // src={activity.user.avatar}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-muted-foreground">
                        {activity.action}
                      </span>
                      {activity.task && typeof activity.task !== "number" && (
                        <span className="font-medium">
                          "{activity.task.title}"
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {activity.task && typeof activity.task !== "number" && (
                        <Badge variant="secondary" className="text-xs">
                          +{activity.task.points} points
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(activity.updatedAt, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-muted-foreground"
                        onClick={() => {
                          addReaction(activity.id, "like");
                        }}
                      >
                        <ThumbsUp
                          className={cn(
                            "mr-1 h-3.5 w-3.5 ",
                            activity.reactions.like.userLiked &&
                              "text-blue-500 fill-blue-500"
                          )}
                        />
                        <span className="text-xs">
                          {activity.reactions.like.count}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-muted-foreground"
                        onClick={() => addReaction(activity.id, "heart")}
                      >
                        <Heart
                          className={cn(
                            "mr-1 h-3.5 w-3.5 ",
                            activity.reactions.heart.userLiked &&
                              "fill-rose-500 text-rose-500"
                          )}
                        />
                        <span className="text-xs">
                          {activity.reactions.heart.count}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-muted-foreground"
                        onClick={() => fetchActivityComments(activity.id)}
                      >
                        <MessageSquare className="mr-1 h-3.5 w-3.5" />
                        <span className="text-xs">{activity.commentCount}</span>
                      </Button>
                    </div>
                  </div>
                </div>
                {Object.keys(comments).includes(activity.id.toString()) && (
                  <ul className="flex flex-col gap-3">
                    {comments[activity.id].map((comment) => {
                      return (
                        <li className="w-[calc(100%-5rem)] text-justify min-h-10 ml-16 flex flex-col gap-1">
                          <div className="flex gap-2 items-center">
                            <Avatar className="h-4 w-4 border">
                              <AvatarImage
                                // src={activity.user.avatar}
                                alt={comment.user.name}
                              />
                              <AvatarFallback className="text-xs">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex gap-4 items-center ">
                              <span className="font-bold text-sm">
                                {comment.user.name}
                              </span>
                              <span className="font-thin text-xs text-slate-400">
                                {formatDate(new Date(comment.createdAt))}
                              </span>
                            </div>
                          </div>
                          <div className="ml-6">
                            <span className="text-sm">{comment.comment}</span>
                          </div>
                        </li>
                      );
                    })}
                    <li className="w-[calc(100%-5rem)] ml-20">
                      <form
                        action={formAction}
                        className="  flex flex-col gap-4"
                      >
                        <input
                          type="hidden"
                          name="activityId"
                          value={activity.id}
                        />
                        <input type="hidden" name="userId" value={1} />
                        <Input type="text" name="comment" />
                        <div className="w-full flex justify-end">
                          <Button variant={"default"} size={"sm"}>
                            Add comment
                          </Button>
                        </div>
                      </form>
                    </li>
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
