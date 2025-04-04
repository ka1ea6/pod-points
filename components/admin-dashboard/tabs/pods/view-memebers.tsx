import { getPodMembers } from "@/actions/pods";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/payload-types";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

interface ViewMembersDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  podId: number;
}

const ViewMembersDialog: React.FC<ViewMembersDialogProps> = ({
  isOpen,
  setIsOpen,
  podId,
}) => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = useCallback(async (podId: number) => {
    setLoading(true);
    const members = await getPodMembers(podId);
    setMembers(members.docs);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers(podId);
  }, [podId]);

  return (
    <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Members</DialogTitle>
          <DialogDescription>List of members</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="w-full flex items-center justify-center py-4">
            <span className="loader"></span>
          </div>
        ) : (
          <>
            {members.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {members
                  .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
                  .map((el) => {
                    return (
                      <li key={el.id}>
                        <Card className="">
                          <CardContent className="px-4 py-2 flex justify-between">
                            <div className="flex flex-col">
                              <span className="font-medium">{el.name}</span>
                              <span className="text-xs">{el.email}</span>
                            </div>
                            <div className="">
                              <div className="rounded-full p-2 border text-sm font-bold">
                                +{el.totalPoints}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <div className="flex justify-center items-center py-4">
                <span>No members yet</span>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewMembersDialog;
