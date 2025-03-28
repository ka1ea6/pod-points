import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { createMember } from "@/actions/users";
import { getAllPods } from "@/actions/pods";
import { Pod } from "@/payload-types";
import { Clipboard } from "lucide-react";

interface AddMemberDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({ open, setOpen }) => {
  const [state, formAction] = useActionState(createMember, {} as any);
  const [pods, setPods] = useState<Pod[]>([]);
  const [userCreated, setUserCreated] = useState(false);

  const fetchPods = useCallback(async () => {
    const res = await getAllPods();
    setPods(res.pods);
  }, []);

  useEffect(() => {
    fetchPods();
  }, []);

  useEffect(() => {
    console.log("state", state);
    if (state && state.status === "success") {
      setUserCreated(true);
      // setOpen(false);
      toast.success("User created successfully", {
        description: "Copy over the password and have the user login",
      });
    }
  }, [state]);

  useEffect(() => {
    if (!open)
      setTimeout(() => {
        setUserCreated(false);
      }, 50);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {userCreated ? (
            <DialogTitle>Copy password</DialogTitle>
          ) : (
            <DialogTitle>Add Member</DialogTitle>
          )}
        </DialogHeader>
        {userCreated ? (
          <div className="w-full flex justify-center">
            <div
              className="border bg-slate-50 px-2 py-1 text-sm text-slate-600 rounded-md w-full flex justify-between items-center"
              onClick={async () => {
                await navigator.clipboard.writeText(state.password);
                toast.success("Password copied");
              }}
            >
              {"*".repeat(16)}
              <Clipboard size={16} />
            </div>
          </div>
        ) : (
          <form action={formAction}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" name="email" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="points" className="text-right">
                  Pod
                </Label>
                <Select defaultValue={""} name="pod">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select pod" />
                  </SelectTrigger>
                  <SelectContent>
                    {pods.map((pod) => (
                      <SelectItem key={pod.id} value={pod.id.toString()}>
                        <div className="flex items-center gap-2">
                          {pod.color && (
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor: pod.color,
                              }}
                            />
                          )}
                          <span>{pod.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
