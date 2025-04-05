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
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pod, User } from "@/payload-types";
import { getAllMembers } from "@/actions/users";
import { createTask } from "@/actions/tasks";
import { useAuth } from "@/providers/auth";
import { Checkbox } from "@/components/ui/checkbox";
import useFormErrors from "@/hooks/useFormError";
import { cn } from "@/lib/utils";
import FormMessage from "@/components/form/message";

interface AddTaskDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const fields = ["title", "description", "link", "points"];
type FieldValues = (typeof fields)[number];

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ open, setOpen }) => {
  const [state, formAction] = useActionState(createTask, {} as any);
  const [members, setMembers] = useState<User[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const { user } = useAuth();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const { setError, getFieldErrors, clearAllErrors, fieldHasErrors } =
    useFormErrors<FieldValues>(fields);

  const fetchMembers = useCallback(async () => {
    const { members } = await getAllMembers();
    setMembers(members.docs);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (state && state.status === "success") {
      setOpen(false);
      toast.success("Task created successfully");
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
      // if (state.data?.link && state.data.link !== "undefined")
      //   descriptionRef.current.value = state.data.link;
      // if (state.data?.points && state.data.points !== "undefined")
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="userId" value={user?.id} />
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
              <div className="flex flex-col col-span-3">
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
              <div className="flex flex-col col-span-3">
                <Textarea
                  id="description"
                  name="description"
                  ref={descriptionRef}
                  className="col-span-3 resize-none"
                  placeholder="Provide details about the task"
                />
                {fieldHasErrors("description") && (
                  <FormMessage message={getFieldErrors("description")[0]} />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="isRecurring"
                className={cn(
                  "text-right self-center",
                  fieldHasErrors("isRecurring") && "text-red-500"
                )}
              >
                Is Recurring
              </Label>
              <Checkbox
                id="isRecurring"
                name="isRecurring"
                checked={isRecurring}
                onCheckedChange={(change) => {
                  setIsRecurring(change === "indeterminate" ? false : change);
                }}
                className="col-span-3 resize-none"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="link"
                className={cn(
                  "text-right self-center",
                  fieldHasErrors("link") && "text-red-500"
                )}
              >
                Link
              </Label>
              <div className="flex flex-col col-span-3">
                <Input
                  id="link"
                  name="link"
                  className={cn(fieldHasErrors("link") && "border-red-500")}
                />
                {fieldHasErrors("link") && (
                  <FormMessage message={getFieldErrors("link")[0]} />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="points"
                className={cn(
                  "text-right self-center",
                  fieldHasErrors("points") && "text-red-500"
                )}
              >
                Points
              </Label>
              <div className="flex flex-col col-span-3">
                <Input
                  id="points"
                  name="points"
                  type="number"
                  min={0}
                  className={cn(fieldHasErrors("points") && "border-red-500")}
                />
                {fieldHasErrors("points") && (
                  <FormMessage message={getFieldErrors("points")[0]} />
                )}
              </div>
            </div>
            {!isRecurring && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="assignee"
                  className={cn(
                    "text-right self-center",
                    fieldHasErrors("name") && "text-red-500"
                  )}
                >
                  Assignee
                </Label>
                <div className="flex flex-col col-span-3">
                  <Select name="assignee">
                    <SelectTrigger
                      className={cn(
                        fieldHasErrors("assignee") && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem
                          key={member.id}
                          value={member.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            {member.pod && (
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{
                                  backgroundColor: (member.pod as Pod).color,
                                }}
                              />
                            )}
                            <span>{member.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldHasErrors("assignee") && (
                    <FormMessage message={getFieldErrors("assignee")[0]} />
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
