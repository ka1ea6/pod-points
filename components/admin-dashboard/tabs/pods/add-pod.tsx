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
  useRef,
  useState,
} from "react";
import { Chrome, Colorful } from "@uiw/react-color";
import { toast } from "sonner";
import { Pod } from "@/payload-types";
import useFormErrors from "@/hooks/useFormError";
import { cn } from "@/lib/utils";
import FormMessage from "@/components/form/message";

interface AddPodDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const fields = ["name", "color"];
type FieldValues = (typeof fields)[number];

const AddPodDialog: React.FC<AddPodDialogProps> = ({ open, setOpen }) => {
  const [state, formAction] = useActionState(createPod, {} as any);
  const [color, setColor] = useState("#000");
  const nameRef = useRef<HTMLInputElement>(null);
  const { setError, getFieldErrors, clearAllErrors, fieldHasErrors } =
    useFormErrors<FieldValues>(fields);

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
      if (state.data?.color) setColor(state.data.color);
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
                  className={cn(fieldHasErrors("name") && "border-red-500")}
                  ref={nameRef}
                />
                {fieldHasErrors("name") && (
                  <FormMessage message={getFieldErrors("name")[0]} />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="username"
                className={cn(
                  "text-right",
                  fieldHasErrors("color") && "text-red-500"
                )}
              >
                Color
              </Label>
              <div className="flex flex-col gap-2 col-span-3 !w-full ">
                <Colorful
                  className="!w-full "
                  color={color}
                  onChange={(color) => setColor(color.hex)}
                />
                {fieldHasErrors("color") && (
                  <FormMessage message={getFieldErrors("color")[0]} />
                )}
              </div>
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
