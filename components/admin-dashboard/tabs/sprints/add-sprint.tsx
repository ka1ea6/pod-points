import { createPod } from "@/actions/pods";
import { createSprint } from "@/actions/sprints";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DAY, WEEK } from "@/lib/constants";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

interface AddSprintDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const AddSprintDialog: React.FC<AddSprintDialogProps> = ({ open, setOpen }) => {
  const [state, formAction] = useActionState(createSprint, {} as any);
  const [fromDate, setFromDate] = useState<Date>(new Date(Date.now() + DAY));
  const [toDate, setToDate] = useState<Date>(new Date(Date.now() + WEEK));

  useEffect(() => {
    if (state && state.status === "success") {
      setOpen(false);
      toast.success("Sprint created successfully");
    }
  }, [state]);

  const handleSubmit = useCallback(
    (formData: FormData) => {
      formData.set("startDate", fromDate.toISOString());
      formData.set("deadline", toDate?.toISOString());
      formAction(formData);
    },
    [fromDate, toDate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Sprint</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" name="title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                className="col-span-3"
              />
            </div>
            <div className="flex justify-center items-center gap-4">
              <Calendar
                mode="range"
                className="col-span-4"
                selected={{
                  from: fromDate,
                  to: toDate,
                }}
                fromDate={new Date()}
                onSelect={(one) => {
                  if (one?.from) setFromDate(one?.from);
                  if (one?.to) setToDate(one?.to);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSprintDialog;
