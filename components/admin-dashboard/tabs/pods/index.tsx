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
import { CalendarIcon, PlusCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { getAllPods } from "@/actions/pods";
import { PodWithCount } from "@/lib/types";
import ViewMembersDialog from "./view-memebers";
import AddPodDialog from "./add-pod";
import EditPodDialog from "./edit-pod";

const PodsTab = () => {
  const [pods, setPods] = useState<PodWithCount[]>([]);
  const [selectedPodId, setSelectedPodId] = useState<number | null>();
  const [viewMembersOpen, setViewMembersOpen] = useState(false);
  const [addPodOpen, setAddPodOpen] = useState(false);
  const [editPodOpen, setEditPodOpen] = useState(false);

  const fetchPods = useCallback(async () => {
    const { pods } = await getAllPods();
    setPods(pods);
  }, []);

  useEffect(() => {
    fetchPods();
  }, []);

  const handleViewMembers = (podId: number) => {
    setViewMembersOpen(true);
    setSelectedPodId(podId);
  };
  const handleEditPod = (podId: number) => {
    setEditPodOpen(true);
    setSelectedPodId(podId);
  };

  useEffect(() => {
    if (!viewMembersOpen && !editPodOpen) setSelectedPodId(null);
  }, [viewMembersOpen, editPodOpen]);

  const [date, setDate] = useState<Date>();

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Pods</CardTitle>
              <CardDescription>
                Create, edit, and manage pod teams
              </CardDescription>
            </div>
            <Button onClick={() => setAddPodOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Pod
            </Button>
            <AddPodDialog open={addPodOpen} setOpen={setAddPodOpen} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pod Name</TableHead>
                {/* <TableHead>Color</TableHead> */}
                <TableHead>Members</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pods.map((pod) => (
                <TableRow key={pod.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: pod.color }}
                      />
                      <span className="font-medium">{pod.name}</span>
                    </div>
                  </TableCell>
                  {/* <TableCell>{pod.color}</TableCell> */}
                  <TableCell>{pod.memberCount}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditPod(pod.id)}
                        size="sm"
                        variant="outline"
                      >
                        Edit
                      </Button>

                      <Button
                        onClick={() => handleViewMembers(pod.id)}
                        size="sm"
                        variant="outline"
                      >
                        View Members
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {selectedPodId && (
                <ViewMembersDialog
                  isOpen={viewMembersOpen}
                  setIsOpen={setViewMembersOpen}
                  podId={selectedPodId}
                />
              )}
              {selectedPodId && (
                <EditPodDialog
                  open={editPodOpen}
                  setOpen={setEditPodOpen}
                  pod={pods.find((el) => el.id === selectedPodId)}
                />
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Set Reward Period</CardTitle>
          <CardDescription>
            Set the end date for the current points period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="grid gap-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button className="self-end">Save</Button>
          </div>
        </CardContent>
      </Card> */}
    </>
  );
};

export default PodsTab;
