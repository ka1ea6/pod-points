import { createPod } from "@/actions/pods";
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
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Chrome, Colorful } from "@uiw/react-color";
import { toast } from "sonner";
import { Pod } from "@/payload-types";

interface AddPodDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const AddPodDialog: React.FC<AddPodDialogProps> = ({ open, setOpen }) => {
  const [state, formAction] = useActionState(createPod, {} as any);
  const [color, setColor] = useState("#000");

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      formData.set("color", color);
      formAction(formData);
    },
    [color]
  );

  useEffect(() => {
    if (state && state.status === "success") {
      setOpen(false);
      toast.success("Pod created successfully");
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add pod</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" className="col-span-3" />
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
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPodDialog;
