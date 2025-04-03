"use client";

import { getUserNotifications, markAllAsRead } from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { dateDisplay } from "@/lib/formatters";
import { SocketArgs } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Notification } from "@/payload-types";
import { useAuth } from "@/providers/auth";
import { useSocket } from "@/providers/socket";
import { Bell } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    socket?.on(
      `notifications/${user?.id}`,
      (args: SocketArgs<Notification>) => {
        if (args.operation === "create") {
          setNotifications((prev) => {
            return [...prev, args.doc];
          });
        } else {
          setNotifications((prev) => {
            return prev.map((el) => (el.id === args.doc.id ? args.doc : el));
          });
        }
      }
    );

    return () => {
      socket?.off(`notifications/${user?.id}`);
    };
  }, [socket, user]);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    const res = await getUserNotifications(user.id);
    setNotifications(res.notifications.docs);
  }, [user]);

  const onMarkAllAsRead = useCallback(async () => {
    await markAllAsRead();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((el) => !el.seen);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {filteredNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {filteredNotifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="grid">
          <div className="px-2 py-4 border-b border-b-slate-100 flex justify-between items-center">
            <h4 className="font-bold leading-none">Notifications</h4>
            <button
              onClick={onMarkAllAsRead}
              className="px-2 py-2 h-fit font-bold text-xs hover:bg-slate-100 rounded-md"
            >
              Mark all as read
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center py-4">
              <span className="font-bold text-sm">No new notifications</span>
            </div>
          ) : (
            <ul className="flex flex-col border max-h-[200px] overflow-y-scroll hide-scrollbar">
              {notifications
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((notification) => {
                  return (
                    <li
                      key={notification.id}
                      className={cn(
                        "border-b border-slate-100 px-4 py-3 hover:bg-slate-50 flex justify-between items-center gap-2",
                        !notification.seen && "bg-slate-100"
                      )}
                    >
                      <div className="flex flex-col overflow-hidden text-ellipsis">
                        <span className="text-sm capitalize">
                          {notification.title}
                        </span>
                        <span className="text-xs text-ellipsis text-slate-600">
                          {notification.description}
                        </span>
                        <span className="text-xs text-slate-400">
                          {dateDisplay(new Date(notification.createdAt))}
                        </span>
                      </div>
                      {!notification.seen && (
                        <div className="h-2 min-w-2 w-2 bg-red-500 rounded-full"></div>
                      )}
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
