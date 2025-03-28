import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { awardPoints, createMember } from "@/actions/users";
import { getAllPods } from "@/actions/pods";
import { Pod } from "@/payload-types";

interface AwardPointsDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userId: number;
}

const AwardPointsDialog: React.FC<AwardPointsDialogProps> = ({
  open,
  setOpen,
  userId,
}) => {
  const [points, setPoints] = useState(0);

  const giftPoint = useCallback(async () => {
    const res = await awardPoints(userId, points);
    if (res && res.status === "success") {
      setOpen(false);
      toast.success(`${res.member.name} has been awarded ${points} points`);
    }
  }, [userId, points]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Award points</DialogTitle>
        </DialogHeader>
        <div>
          <input type="hidden" name="userId" value={userId} />
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                points
              </Label>
              <Input
                id="points"
                name="points"
                value={points}
                onChange={(value) => setPoints(+value.currentTarget.value)}
                type="number"
                className="col-span-3"
              />
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Reason
                </Label>
                <Input id="reason" name="reason" className="col-span-3" />
              </div> */}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => giftPoint()}>
              Award points
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AwardPointsDialog;
