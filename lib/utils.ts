import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeResponse<T>(res: Object | null) {
  if (!res) return null;
  return Object.fromEntries(
    Object.entries(res).filter(([key]) => !key.startsWith("_"))
  ) as T;
}
