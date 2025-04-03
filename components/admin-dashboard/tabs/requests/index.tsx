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
import { CheckCircle, User, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { changeRequestStatus, getPendingRequests } from "@/actions/requests";
import { Request } from "@/payload-types";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth";
import { useSocket } from "@/providers/socket";
import { SocketArgs } from "@/lib/types";

const RequestsTab = () => {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    socket?.on("request", (args: SocketArgs<Request>) => {
      if (args.operation === "create") {
        setPendingRequests((prev) => {
          return [...prev, args.doc];
        });
      } else {
        setPendingRequests((prev) => {
          return prev.map((el) => {
            if (el.id === args.doc.id) return args.doc;
            return el;
          });
        });
      }
    });
    return () => {
      socket?.off("request");
    };
  }, [socket]);

  const fetchPendingRequests = useCallback(async () => {
    const res = await getPendingRequests();
    setPendingRequests(res.requests);
  }, []);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleApprove = useCallback(async (id: number) => {
    if (!user) return;
    const { request, status } = await changeRequestStatus(id, "approved");
    if (status === "success") {
      toast.success(
        `Request by ${request.requestBy.name} for task ${request.title} has been approved`
      );
    }
    // setPendingRequests(pendingRequests.filter((request) => request.id !== id));
    // In a real app, you would also update the user's points and pod points
  }, []);

  const handleReject = useCallback(async (id: number) => {
    const { request, status } = await changeRequestStatus(id, "rejected");
    if (status === "success") {
      toast.error(
        `Request by ${request.requestBy.name} for task ${request.title} has been rejected`
      );
    }

    // In a real app, you would also notify the user
  }, []);

  const filteredRequests = pendingRequests.filter(
    (el) => el.status === "requested"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Point Requests</CardTitle>
        <CardDescription>
          Review and approve point requests from team members
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredRequests.length === 0 ? (
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
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        className="h-8 w-8 border-2"
                        style={{ borderColor: request.requestBy.pod?.color }}
                      >
                        <AvatarImage
                          // src={request.requestBy.avatar}
                          alt={request.requestBy.name}
                        />
                        <AvatarFallback>
                          {request.requestBy.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {request.requestBy.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {request.requestBy.pod?.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{request.title}</TableCell>
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
