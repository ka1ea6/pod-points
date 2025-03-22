"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageSquare, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PointsActivity() {
  const [activities, setActivities] = useState([
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        pod: { name: "Red Pod", color: "#ef4444" },
      },
      action: "completed",
      task: "Weekly team meeting",
      points: 5,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      reactions: { likes: 2, hearts: 1 },
      comments: 1,
    },
    {
      id: 2,
      user: {
        name: "Sam Taylor",
        avatar: "/placeholder.svg?height=32&width=32",
        pod: { name: "Blue Pod", color: "#3b82f6" },
      },
      action: "earned",
      task: "Client presentation",
      points: 15,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      reactions: { likes: 5, hearts: 3 },
      comments: 2,
    },
    {
      id: 3,
      user: {
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        pod: { name: "Green Pod", color: "#10b981" },
      },
      action: "volunteered",
      task: "Organize team lunch",
      points: 10,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      reactions: { likes: 4, hearts: 2 },
      comments: 0,
    },
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>See what your team has been up to</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <Avatar className="h-8 w-8 border-2" style={{ borderColor: activity.user.pod.color }}>
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-medium">{activity.user.name}</span>
                  <span className="text-muted-foreground">{activity.action}</span>
                  <span className="font-medium">"{activity.task}"</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    +{activity.points} points
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground">
                    <ThumbsUp className="mr-1 h-3.5 w-3.5" />
                    <span className="text-xs">{activity.reactions.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground">
                    <Heart className="mr-1 h-3.5 w-3.5" />
                    <span className="text-xs">{activity.reactions.hearts}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground">
                    <MessageSquare className="mr-1 h-3.5 w-3.5" />
                    <span className="text-xs">{activity.comments}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

