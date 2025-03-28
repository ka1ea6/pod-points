import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useCallback } from "react";
import { removeTask } from "@/actions/tasks";
import { toast } from "sonner";

interface DeleteTaskDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userId: number;
  taskId: number;
}

const DeleteTaskDialog: React.FC<DeleteTaskDialogProps> = ({
  open,
  setOpen,
  userId,
  taskId,
}) => {
  const handleRemoveTask = useCallback(async () => {
    const res = await removeTask(taskId, userId);
    if (res?.status === "success") {
      setOpen(false);
      toast.success("Task removed successfully");
    }
  }, [taskId, userId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>Remove Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="!justify-center">
          <Button type="button">Cancel</Button>
          <Button
            type="button"
            onClick={handleRemoveTask}
            variant={"destructive"}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTaskDialog;
