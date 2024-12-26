
import { currentUser } from "@clerk/nextjs/server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseColor(color: string) {
  const hexCode = color.replace("#", "");
  return parseInt(hexCode, 16);
}


