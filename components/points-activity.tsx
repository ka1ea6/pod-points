"use client";

import { use, useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, ThumbsUp } from "lucide-react";
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
import { Activity, User } from "@/payload-types";
import { getAllActivities } from "@/actions/activities";

export function PointsActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchActivities = useCallback(async () => {
    const res = await getAllActivities();
    if (res && res.activities) setActivities(res.activities?.docs);
  }, []);

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
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-muted-foreground"
                    >
                      <ThumbsUp className="mr-1 h-3.5 w-3.5" />
                      <span className="text-xs">
                        {activity.reactions.likes}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-muted-foreground"
                    >
                      <Heart className="mr-1 h-3.5 w-3.5" />
                      <span className="text-xs">
                        {activity.reactions.hearts}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-muted-foreground"
                    >
                      <MessageSquare className="mr-1 h-3.5 w-3.5" />
                      <span className="text-xs">{activity.comments}</span>
                    </Button> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
