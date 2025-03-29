import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { removeTask } from "@/actions/tasks";
import { toast } from "sonner";
import { endSprint, getOngoingSprintTasks } from "@/actions/sprints";
import { Task } from "@/payload-types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EndSprintDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userId: number;
  sprintId: number;
}

const EndSprintDialog: React.FC<EndSprintDialogProps> = ({
  open,
  setOpen,
  userId,
  sprintId,
}) => {
  const [ongoingTasks, setOngoingTasks] = useState<Task[]>([]);

  const fetchOngoingTasks = useCallback(async () => {
    const res = await getOngoingSprintTasks(sprintId);
    setOngoingTasks(res.tasks.docs);
  }, [sprintId]);

  useEffect(() => {
    fetchOngoingTasks();
  }, []);

  const handleEndSprint = useCallback(async () => {
    const res = await endSprint({ sprintId, userId });
    if (res?.status === "success") {
      setOpen(false);
      toast.success("Sprint ended successfully");
    }
  }, [sprintId, userId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>End Sprint</DialogTitle>
          <DialogDescription className="text-center">
            {ongoingTasks.length > 0
              ? "There are unresolved tasks in this sprint. Please resolve them before ending the sprint."
              : "Are you sure you want to end the sprint?"}
          </DialogDescription>
        </DialogHeader>
        {ongoingTasks.length > 0 && (
          <ul className="flex flex-col gap-1">
            {ongoingTasks.map((task) => {
              return (
                <li key={task.id} className="">
                  <div className="mb-2 cursor-pointer rounded-md border bg-card p-3 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-2">
                          <span>{task.title}</span>
                          <Badge className="capitalize" variant="default">
                            {task.status}
                          </Badge>
                        </div>
                        <div className="line-clamp-2 text-xs text-muted-foreground">
                          {task.description}
                        </div>
                      </div>
                      <Badge variant="secondary">+{task.points}</Badge>
                    </div>
                    {task.assignee && typeof task.assignee !== "number" && (
                      <div className="mt-2 flex items-center">
                        <Avatar className="h-5 w-5 mr-1">
                          <AvatarImage
                            // src={task.assignee.avatar}
                            alt={task.assignee.name}
                          />
                          <AvatarFallback>
                            {task.assignee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {task.assignee.name}
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <DialogFooter className="!justify-center">
          <Button type="button">Cancel</Button>
          <Button
            type="button"
            disabled={ongoingTasks.length > 0}
            onClick={handleEndSprint}
            variant={"destructive"}
          >
            End Sprint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EndSprintDialog;
