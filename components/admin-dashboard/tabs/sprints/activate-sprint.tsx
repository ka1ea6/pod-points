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
import { toast } from "sonner";
import {
  activateSprint,
  endSprint,
  getOngoingSprintTasks,
} from "@/actions/sprints";
import { Task } from "@/payload-types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivateSprintDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userId: number;
  sprintId: number;
}

const ActivateSprintDialog: React.FC<ActivateSprintDialogProps> = ({
  open,
  setOpen,
  userId,
  sprintId,
}) => {
  // const [ongoingTasks, setOngoingTasks] = useState<Task[]>([]);

  // const fetchOngoingTasks = useCallback(async () => {
  //   const res = await getOngoingSprintTasks(sprintId);
  //   setOngoingTasks(res.tasks.docs);
  // }, [sprintId]);

  // useEffect(() => {
  //   fetchOngoingTasks();
  // }, []);

  const handleActivateSprint = useCallback(async () => {
    const res = await activateSprint({ sprintId, userId });
    if (res?.status === "success") {
      setOpen(false);
      toast.success("Sprint activated.");
    }
  }, [sprintId, userId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>Activate Sprint</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to activate this sprint?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="!justify-center">
          <Button type="button" variant={"outline"}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleActivateSprint}
            variant={"default"}
          >
            Activate Sprint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivateSprintDialog;
