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

export function getId(
  item: number | { id: number },
  returnAs: "number" | "string" = "string"
) {
  const id = typeof item === "number" ? item : item.id;

  return returnAs === "number" ? id : id.toString();
}
