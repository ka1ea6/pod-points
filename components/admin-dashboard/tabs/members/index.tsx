"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Heading1, PlusCircle } from "lucide-react";
import { getAllPods } from "@/actions/pods";
import { changeMemberPod, getAllMembers } from "@/actions/users";
import { Pod, User } from "@/payload-types";
import AddMemberDialog from "./add-member";
import { toast } from "sonner";
import AwardPointsDialog from "./award-points";
import { useSocket } from "@/providers/socket";
import { SocketArgs } from "@/lib/types";

const MembersTab = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [pods, setPods] = useState<Pod[]>([]);
  const [podValues, setPodValues] = useState<Record<string, string>>({});
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [awardMemberOpen, setAwardMemberOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  // const podSelectRef = useRef<HTMLSelectElement>(null);

  const { socket } = useSocket();

  useEffect(() => {
    socket?.on("users", (args: SocketArgs<User>) => {
      if (args.operation === "create") {
        setMembers((prev) => {
          return [...prev, args.doc];
        });
      } else {
        setMembers((prev) => {
          return prev.map((el) => {
            if (el.id === args.doc.id) return args.doc;
            return el;
          });
        });
      }
    });
    return () => {
      socket?.off("users");
    };
  }, [socket]);

  useEffect(() => {
    setPodValues((_) => {
      return members.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.id.toString()]:
            typeof curr.pod === "number"
              ? curr.pod.toString()
              : curr.pod?.id.toString(),
        }),
        {}
      );
    });
  }, [members]);

  const fetchMembers = useCallback(async () => {
    const { members } = await getAllMembers();
    setMembers(members.docs);
  }, []);

  const fetchPods = useCallback(async () => {
    const { pods } = await getAllPods();
    setPods(pods);
  }, []);

  const handlePodChange = useCallback(async (userId: number, podId: number) => {
    const { member } = await changeMemberPod(userId, podId);
    toast.success(`${member.name} added to pod '${member.pod?.name}'`);
  }, []);

  useEffect(() => {
    fetchMembers();
    fetchPods();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Manage Team Members</CardTitle>
            <CardDescription>
              Add members to pods and manage their roles
            </CardDescription>
          </div>
          <Button onClick={() => setAddMemberOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Member
          </Button>
          <AddMemberDialog open={addMemberOpen} setOpen={setAddMemberOpen} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Pod</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="font-medium">{member.name}</div>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={
                      typeof member.pod === "number"
                        ? member.pod.toString()
                        : member.pod?.id.toString()
                    }
                    onValueChange={(value) => {
                      handlePodChange(member.id, parseInt(value));
                      setPodValues((prev) => {
                        return { ...prev, [member.id]: value };
                      });
                    }}
                    value={podValues[member.id]}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select pod" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value=" ">Select Pod</SelectItem> */}
                      {pods.map((pod) => (
                        <SelectItem key={pod.id} value={pod.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: pod.color }}
                            />
                            <span>{pod.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">+{member.totalPoints}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {/* <Button size="sm" variant="outline">
                      Edit
                    </Button> */}
                    <Button
                      onClick={() => {
                        setSelectedMemberId(member.id);
                        setAwardMemberOpen(true);
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Award Points
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedMemberId && (
          <AwardPointsDialog
            open={awardMemberOpen}
            setOpen={setAwardMemberOpen}
            userId={selectedMemberId}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MembersTab;
