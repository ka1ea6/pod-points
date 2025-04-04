"use client";

import { getAllMembers, getPodMembers } from "@/actions/users";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserWithTaskCount } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth";
import { useCallback, useEffect, useState } from "react";

const Page = () => {
  const [users, setUsers] = useState<UserWithTaskCount[]>([]);
  const { user: currUser } = useAuth();

  const fetchMembers = useCallback(async () => {
    const res = await getPodMembers();
    if (res.members) setUsers(res.members);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      {currUser?.pod ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span>{currUser?.pod?.name}</span>
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: currUser?.pod?.color }}
                  />
                </CardTitle>
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
                  <TableHead>Completed tasks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users
                  .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
                  .map((user, index) => {
                    return (
                      <TableRow key={user.id} className={cn("")}>
                        <TableCell>
                          <span className={cn("text-center font-medium")}>
                            {index + 1}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {currUser?.id === user.id ? "You" : user.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">+{user.totalPoints}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{user.tasks.approved}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="flex h-full flex-1 items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>You don't have a pod</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}
    </main>
  );
};

export default Page;
