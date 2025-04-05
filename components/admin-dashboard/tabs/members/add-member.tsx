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
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { createMember } from "@/actions/users";
import { getAllPods } from "@/actions/pods";
import { Pod } from "@/payload-types";
import { Clipboard } from "lucide-react";
import useFormErrors from "@/hooks/useFormError";
import { cn } from "@/lib/utils";

interface AddMemberDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const fields = ["name", "email"];
type FieldValues = (typeof fields)[number];

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({ open, setOpen }) => {
  const [state, formAction] = useActionState(createMember, {} as any);
  const [pods, setPods] = useState<Pod[]>([]);
  const [userCreated, setUserCreated] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const { setError, getFieldErrors, clearAllErrors, fieldHasErrors } =
    useFormErrors<FieldValues>(fields);

  const fetchPods = useCallback(async () => {
    const res = await getAllPods();
    setPods(res.pods);
  }, []);

  useEffect(() => {
    fetchPods();
  }, []);

  useEffect(() => {
    if (state && state.status === "success") {
      setUserCreated(true);
      // setOpen(false);
      toast.success("User created successfully", {
        description: "Copy over the password and have the user login",
      });
    } else if (state.errors) {
      const keys = Object.keys(state.errors).filter((el) =>
        fields.includes(el)
      );

      clearAllErrors();

      for (const key of keys) {
        setError(key, state.errors[key]);
      }

      if (state.data?.name && nameRef.current)
        nameRef.current.value = state.data.name;
      if (state.data?.name && emailRef.current)
        emailRef.current.value = state.data.email;
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
                <Label
                  htmlFor="name"
                  className={cn(
                    "text-right self-center",
                    fieldHasErrors("name") && "text-red-500"
                  )}
                >
                  Name
                </Label>
                <div className="flex flex-col col-span-3">
                  <Input
                    id="name"
                    name="name"
                    ref={nameRef}
                    className={cn(fieldHasErrors("name") && "border-red-500")}
                  />
                  {fieldHasErrors("name") && (
                    <p className="text-red-500 text-sm">
                      {getFieldErrors("name")[0]}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="email"
                  className={cn(
                    "text-right self-center",
                    fieldHasErrors("name") && "text-red-500"
                  )}
                >
                  Email
                </Label>
                <div className="flex flex-col col-span-3">
                  <Input
                    id="email"
                    name="email"
                    ref={emailRef}
                    className={cn(fieldHasErrors("email") && "border-red-500")}
                  />
                  {fieldHasErrors("email") && (
                    <p className="text-red-500 text-sm">
                      {getFieldErrors("email")[0]}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="points" className="text-right">
                  Pod
                </Label>
                <div className="flex flex-col col-span-3">
                  <Select defaultValue={""} name="pod">
                    <SelectTrigger
                      className={cn(
                        fieldHasErrors("assignee") && "border-red-500"
                      )}
                    >
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
