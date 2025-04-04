"use client";

import { getAllMembers } from "@/actions/users";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { User } from "@/payload-types";
import { useCallback, useEffect, useState } from "react";

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchMembers = useCallback(async () => {
    const res = await getAllMembers();
    setUsers(res.members.docs);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Leader board</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Pod</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users
                .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
                .map((user, index) => {
                  return (
                    <TableRow key={user.id} className={cn("")}>
                      <TableCell>
                        <span
                          className={cn(
                            "text-center",
                            index < 3 ? "font-bold" : "font-light",
                            index === 0 && "text-[#FFD700]",
                            index === 1 && "text-[#C0C0C0]",
                            index === 2 && "text-[#CD7F32]"
                          )}
                        >
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{user.name}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">+{user.totalPoints}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: user.pod?.color }}
                          />
                          <span>{user.pod?.name}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

export default Page;
