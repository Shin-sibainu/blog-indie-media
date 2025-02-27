import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$1/$2/$3");
}
