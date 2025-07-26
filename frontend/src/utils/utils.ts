import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}
