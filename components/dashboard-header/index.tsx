"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Notifications from "./notifications";
import { useAuth } from "@/providers/auth";
import { useCallback } from "react";

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
    image?: string;
    role?: string;
  };
}

export function DashboardHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAdmin = user && user.role === "lead";

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
            <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-primary-foreground">
              PP
            </div>
          </div>
          <span className="text-xl font-bold">Pod Points</span>
        </Link>
        <nav className="hidden md:flex md:gap-6 md:text-sm md:font-medium md:ml-6">
          {!user ? (
            <></>
          ) : (
            <>
              <Link
                href="/"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/" ? "text-foreground" : "text-foreground/60"
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/my-pod"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname?.startsWith("/my-pod")
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                My Pod
              </Link>
              {/* <Link
                href="/tasks"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname?.startsWith("/tasks")
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                Tasks
              </Link> */}
              <Link
                href="/leaderboard"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname?.startsWith("/leaderboard")
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                Leaderboard
              </Link>
              {isAdmin && (
                <Link
                  href="/manage"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname?.startsWith("/admin")
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  Manage
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
      {user ? (
        <div className="flex items-center gap-4">
          <Notifications />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className=""></div>
      )}
    </header>
  );
}
