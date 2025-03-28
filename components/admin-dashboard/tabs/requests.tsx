import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

const RequestsTab = () => {
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        pod: { name: "Red Pod", color: "#ef4444" },
      },
      task: "Client presentation",
      points: 15,
      evidence: "https://docs.example.com/presentation",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: 2,
      user: {
        name: "Sam Taylor",
        avatar: "/placeholder.svg?height=32&width=32",
        pod: { name: "Blue Pod", color: "#3b82f6" },
      },
      task: "Bug fix in production",
      points: 12,
      evidence: "https://github.com/example/repo/pull/123",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  ]);

  const handleApprove = (id: number) => {
    setPendingRequests(pendingRequests.filter((request) => request.id !== id));
    // In a real app, you would also update the user's points and pod points
  };

  const handleReject = (id: number) => {
    setPendingRequests(pendingRequests.filter((request) => request.id !== id));
    // In a real app, you would also notify the user
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Point Requests</CardTitle>
        <CardDescription>
          Review and approve point requests from team members
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingRequests.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                No pending requests
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Evidence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        className="h-8 w-8 border-2"
                        style={{ borderColor: request.user.pod.color }}
                      >
                        <AvatarImage
                          src={request.user.avatar}
                          alt={request.user.name}
                        />
                        <AvatarFallback>
                          {request.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{request.user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {request.user.pod.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{request.task}</TableCell>
                  <TableCell>
                    <Badge variant="outline">+{request.points}</Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={request.evidence}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      View Evidence
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleApprove(request.id)}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleReject(request.id)}
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestsTab;
