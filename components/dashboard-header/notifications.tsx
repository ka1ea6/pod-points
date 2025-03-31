"use client";

import { getUserNotifications } from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/formatters";
import { Notification } from "@/payload-types";
import { Bell } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = useCallback(async () => {
    const res = await getUserNotifications(1);
    setNotifications(res.notifications.docs);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {notifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="grid">
          <div className="px-2 py-4 border-b border-b-slate-100 flex justify-between items-center">
            <h4 className="font-bold leading-none">Notifications</h4>
            <button className="px-2 py-2 h-fit font-bold text-xs hover:bg-slate-100 rounded-md">
              Mark all as read
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center pb-4">
              <span className="font-bold">No new notifications</span>
            </div>
          ) : (
            <ul className="flex flex-col border max-h-[200px] overflow-y-scroll hide-scrollbar">
              {notifications.map((notification) => {
                return (
                  <li
                    key={notification.id}
                    className="border-b border-slate-100 px-4 py-3 hover:bg-slate-50 flex justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold capitalize">
                        {notification.description}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(new Date(notification.createdAt))}
                      </span>
                    </div>
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
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
