import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { getAllPods } from "@/actions/pods";
import { Pod } from "@/payload-types";
import { Textarea } from "@/components/ui/textarea";
import { createRequest } from "@/actions/requests";

interface RequestPointsDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userId: number;
}

const RequestPointsDialog: React.FC<RequestPointsDialogProps> = ({
  open,
  setOpen,
  userId,
}) => {
  const [state, formAction] = useActionState(createRequest, {} as any);

  useEffect(() => {
    if (state && state.status === "success") {
      // setOpen(false);
      toast.success("Point request sent", {
        description: "Your request has been successfully sent.",
      });
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Points</DialogTitle>
          <DialogDescription>
            Submit a request for points for a completed task.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="requestBy" value={userId} />
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Task
              </Label>
              <Input id="title" name="title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                Points
              </Label>
              <Input
                id="points"
                type="number"
                name="points"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="evidence" className="text-right">
                Evidence
              </Label>
              <Input
                id="evidence"
                name="evidence"
                className="col-span-3"
                placeholder="Link or description of evidence"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestPointsDialog;
