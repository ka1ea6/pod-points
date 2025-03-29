import { changeDateRange } from "@/actions/sprints";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sprint } from "@/payload-types";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { toast } from "sonner";

interface ChangeDateRangeDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  sprint: Sprint;
}

const ChangeDateRangeDialog: React.FC<ChangeDateRangeDialogProps> = ({
  open,
  setOpen,
  sprint,
}) => {
  const [fromDate, setFromDate] = useState<Date>(new Date(sprint.startDate));
  const [toDate, setToDate] = useState<Date>(new Date(sprint.deadline));

  const handleExtend = useCallback(async () => {
    const res = await changeDateRange({
      sprintId: sprint.id,
      from: fromDate,
      to: toDate,
    });
    if (res.status === "success") {
      setOpen(false);
      toast.success(
        `Deadline for ${res.sprint.title} changed to ${new Date(res.sprint.deadline).toLocaleDateString()}`
      );
    }
  }, [sprint, fromDate, toDate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change deadline date</DialogTitle>
        </DialogHeader>
        <form>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center">
              {/* <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label> */}
              {/* <Input
                id="deadline"
                type="date"
                name="deadline"
                value={new Date(sprint.deadline).toLocaleString()}
                className="col-span-3"
              /> */}
              {sprint.isActive ? (
                <Calendar
                  mode="single"
                  className="col-span-4"
                  selected={toDate}
                  fromDate={new Date()}
                  onSelect={setToDate}
                />
              ) : (
                <Calendar
                  mode="range"
                  className="col-span-4"
                  selected={{
                    from: fromDate,
                    to: toDate,
                  }}
                  fromDate={new Date()}
                  onSelect={(one, two) => {
                    if (one?.from) setFromDate(one?.from);
                    if (one?.to) setToDate(one?.to);
                  }}
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleExtend}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeDateRangeDialog;
