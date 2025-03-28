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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pod, Task, User } from "@/payload-types";
import { getAllMembers } from "@/actions/users";
import { createTask, updateTask } from "@/actions/tasks";

interface EditTaskDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  task: Task;
  userId: number;
}

const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  open,
  setOpen,
  task,
  userId,
}) => {
  const [state, formAction] = useActionState(updateTask, {} as any);
  const [members, setMembers] = useState<User[]>([]);

  const fetchMembers = useCallback(async () => {
    const { members } = await getAllMembers();
    setMembers(members.docs);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    console.log("state", state);
    if (state && state.status === "success") {
      setOpen(false);
      toast.success("Pod updated successfully");
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="userId" value={1} />
          <input type="hidden" name="taskId" value={task.id} />
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={task.title}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                className="col-span-3 resize-none"
                defaultValue={task.description || ""}
                // value={pointRequest.description}
                // onChange={(e) =>
                //   setPointRequest({
                //     ...pointRequest,
                //     description: e.target.value,
                //   })
                // }
                placeholder="Provide details about the task"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Link
              </Label>
              <Input
                id="link"
                name="link"
                defaultValue={task.link || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                Points
              </Label>
              <Input
                id="points"
                name="points"
                type="number"
                className="col-span-3"
                defaultValue={task.points}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                Assignee
              </Label>
              <Select defaultValue={task.assignee?.toString()}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
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

export default EditTaskDialog;
