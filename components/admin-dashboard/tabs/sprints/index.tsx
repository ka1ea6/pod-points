"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SprintWithTaskCount } from "@/lib/types";
import { getAllSprints } from "@/actions/sprints";
import { Badge } from "@/components/ui/badge";
import ExtendDeadlineDialog from "./change-date-range";
import EndSprintDialog from "./end-sprint";
import ActivateSprintDialog from "./activate-sprint";
import { formatDate } from "@/lib/formatters";
import AddSprintDialog from "./add-sprint";
import { useAuth } from "@/providers/auth";

const SprintsTab = () => {
  const { user } = useAuth();

  const [sprints, setSprints] = useState<SprintWithTaskCount[]>([]);
  const [selectedSprint, setSelectedSprint] =
    useState<SprintWithTaskCount | null>();
  const [changeDateRangeOpen, setChangeDateRangeOpen] = useState(false);
  const [addSprintOpen, setAddSprintOpen] = useState(false);
  const [endSprintOpen, setEndSprintOpen] = useState(false);
  const [activateSprintOpen, setActivateSprintOpen] = useState(false);

  const fetchSprints = useCallback(async () => {
    const { sprints } = await getAllSprints();
    if (sprints) setSprints(sprints);
  }, []);

  useEffect(() => {
    fetchSprints();
  }, []);

  useEffect(() => {
    if (!endSprintOpen) setSelectedSprint(null);
  }, [endSprintOpen]);

  const handleChangeDate = useCallback((sprint: SprintWithTaskCount) => {
    setChangeDateRangeOpen(true);
    setSelectedSprint(sprint);
  }, []);

  const handleEndSprint = useCallback((sprint: SprintWithTaskCount) => {
    setEndSprintOpen(true);
    setSelectedSprint(sprint);
  }, []);

  const handleActivateSprint = useCallback((sprint: SprintWithTaskCount) => {
    setActivateSprintOpen(true);
    setSelectedSprint(sprint);
  }, []);

  const isPast = (date: Date) => {
    const now = new Date().getTime();
    const time = date.getTime();

    return now - time > 0;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Sprints</CardTitle>
              <CardDescription>
                Create, edit, and manage sprints
              </CardDescription>
            </div>
            <Button onClick={() => setAddSprintOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Sprint
            </Button>
            <AddSprintDialog open={addSprintOpen} setOpen={setAddSprintOpen} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sprint name</TableHead>
                <TableHead>Number of tasks</TableHead>
                <TableHead>Start date</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sprints
                .sort(
                  (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime()
                )
                // .sort((el) => (el.isActive ? -1 : 1))
                .map((sprint) => (
                  <TableRow key={sprint.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{sprint.title}</span>
                        {sprint.isActive && <Badge>Active</Badge>}
                      </div>
                    </TableCell>
                    {/* <TableCell>{pod.color}</TableCell> */}
                    <TableCell>{sprint.taskCount}</TableCell>
                    <TableCell>
                      {formatDate(new Date(sprint.startDate))}
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(sprint.deadline))}
                    </TableCell>
                    <TableCell>
                      {sprint.isActive ? (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleChangeDate(sprint)}
                            size="sm"
                            variant="outline"
                          >
                            Change deadline
                          </Button>
                          <Button
                            onClick={() => handleEndSprint(sprint)}
                            size="sm"
                            variant="destructive"
                          >
                            End sprint
                          </Button>
                        </div>
                      ) : (
                        <>
                          {isPast(new Date(sprint.deadline)) ? (
                            <div>
                              <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                Sprint ended on{" "}
                                {formatDate(new Date(sprint.deadline))}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleChangeDate(sprint)}
                                size="sm"
                                variant="outline"
                              >
                                Change date range
                              </Button>
                              <Button
                                onClick={() => handleActivateSprint(sprint)}
                                size={"sm"}
                              >
                                Activate sprint
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {sprints.length === 0 && (
            <div className="flex justify-center py-4">
              <span className="font-bold text-lg">No sprints yet.</span>
            </div>
          )}

          {selectedSprint && changeDateRangeOpen && (
            <ExtendDeadlineDialog
              open={changeDateRangeOpen}
              setOpen={setChangeDateRangeOpen}
              sprint={selectedSprint}
            />
          )}
          {selectedSprint && endSprintOpen && user && (
            <EndSprintDialog
              open={endSprintOpen}
              setOpen={setEndSprintOpen}
              sprintId={selectedSprint.id}
              userId={user.id}
            />
          )}
          {selectedSprint && activateSprintOpen && user && (
            <ActivateSprintDialog
              open={activateSprintOpen}
              setOpen={setActivateSprintOpen}
              sprintId={selectedSprint.id}
              userId={user.id}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default SprintsTab;
