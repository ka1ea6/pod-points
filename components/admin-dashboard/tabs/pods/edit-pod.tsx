import { editPod, getMembersNotInPod } from "@/actions/pods";
import { Button } from "@/components/ui/button";
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
import { MultiSelect } from "@/components/ui/multiSelect";
import { PodWithCount } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pod, User } from "@/payload-types";
import { Colorful } from "@uiw/react-color";
import { Circle } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

interface EditPodDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  pod?: Pod | PodWithCount | null;
}

const EditPodDialog: React.FC<EditPodDialogProps> = ({
  open,
  setOpen,
  pod,
}) => {
  const [state, formAction] = useActionState(editPod, {} as any);
  const [color, setColor] = useState<string>(pod?.color || "#000");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [membersToAdd, setMembersToAdd] = useState<User[]>([]);

  const fetchMembers = useCallback(async (podId: number) => {
    const res = await getMembersNotInPod(podId);
    setMembersToAdd(res.docs);
  }, []);

  useEffect(() => {
    if (pod) fetchMembers(pod?.id);
  }, [pod]);

  const handleSubmit = useCallback(
    (formData: FormData) => {
      formData.set("color", color);
      formData.set("members", JSON.stringify(selectedMembers));
      formAction(formData);
    },
    [color, selectedMembers]
  );

  useEffect(() => {
    if (state && state.status === "success") {
      setOpen(false);
      toast.success("Successfully edited pod.");
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pod</DialogTitle>
          <DialogDescription>
            Make changes to the pod here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <input type="hidden" name="podId" value={pod?.id} />
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={pod?.name}
                autoFocus={false}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Color
              </Label>
              <Colorful
                className="col-span-3 !w-full"
                color={color}
                onChange={(color) => setColor(color.hex)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Members
              </Label>
              <MultiSelect
                className="col-span-3"
                options={membersToAdd.map((el) => ({
                  label: `${el.name}`,
                  value: el.id.toString(),
                  icon: el.pod ? getLabelDot((el.pod as Pod).color) : undefined,
                }))}
                onValueChange={(change) => {
                  setSelectedMembers(change);
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

export default EditPodDialog;

const getLabelDot: (
  bgColor: string
) => React.ComponentType<{ className?: string }> = (bgColor) => {
  return ({ className }) => {
    return (
      <span
        className={cn("w-2 h-2 rounded-full ", className)}
        style={{
          background: bgColor,
        }}
      ></span>
    );
  };
};
