import { createPod } from "@/actions/pods";
import { createSprint } from "@/actions/sprints";
import FormMessage from "@/components/form/message";
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
import useFormErrors from "@/hooks/useFormError";
import { DAY, WEEK } from "@/lib/constants";
import { cn } from "@/lib/utils";
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

interface AddSprintDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const fields = ["title", "description", "startDate", "deadline"];
type FieldValues = (typeof fields)[number];

const AddSprintDialog: React.FC<AddSprintDialogProps> = ({ open, setOpen }) => {
  const [state, formAction] = useActionState(createSprint, {} as any);
  const [fromDate, setFromDate] = useState<Date>(new Date(Date.now() + DAY));
  const [toDate, setToDate] = useState<Date>(new Date(Date.now() + WEEK));
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const { setError, getFieldErrors, clearAllErrors, fieldHasErrors } =
    useFormErrors<FieldValues>(fields);

  useEffect(() => {
    if (state && state.status === "success") {
      setOpen(false);
      toast.success("Sprint created successfully");
    } else if (state.errors) {
      const keys = Object.keys(state.errors).filter((el) =>
        fields.includes(el)
      );

      clearAllErrors();

      for (const key of keys) {
        setError(key, state.errors[key]);
      }

      if (state.data?.title && titleRef.current)
        titleRef.current.value = state.data.title;
      if (state.data?.description && descriptionRef.current)
        descriptionRef.current.value = state.data.description;
      if (state.data?.startDate) setFromDate(new Date(state.data.startDate));
      if (state.data?.deadline) setToDate(new Date(state.data.deadline));
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
              <Label
                htmlFor="title"
                className={cn(
                  "text-right self-center",
                  fieldHasErrors("title") && "text-red-500"
                )}
              >
                Title
              </Label>
              <div className="flex flex-col gap-1 col-span-3">
                <Input
                  id="title"
                  name="title"
                  ref={titleRef}
                  className={cn(fieldHasErrors("title") && "border-red-500")}
                />
                {fieldHasErrors("title") && (
                  <FormMessage message={getFieldErrors("title")[0]} />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="description"
                className={cn(
                  "text-right self-center",
                  fieldHasErrors("description") && "text-red-500"
                )}
              >
                Description
              </Label>
              <div className="flex flex-col gap-1 col-span-3">
                <Input
                  id="description"
                  name="description"
                  ref={descriptionRef}
                  className={cn(fieldHasErrors("title") && "border-red-500")}
                />
                {fieldHasErrors("description") && (
                  <FormMessage message={getFieldErrors("description")[0]} />
                )}
              </div>
            </div>
            <div className="flex justify-center items-center gap-4">
              <div className="flex flex-col gap-2">
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
                {fieldHasErrors("startDate") && (
                  <FormMessage message={getFieldErrors("startDate")[0]} />
                )}
                {fieldHasErrors("deadline") && (
                  <FormMessage message={getFieldErrors("deadline")[0]} />
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

export default AddSprintDialog;
