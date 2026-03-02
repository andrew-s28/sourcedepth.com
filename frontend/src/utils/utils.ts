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

export function meshGrid({x, y}: {x: number[]; y: number[]}): {xx: number[][]; yy: number[][]} {
    const xx = [];
    const yy = [];

    for (let i = 0; i < y.length; i++) {
        const xRow = [];
        const yRow = [];
        for (let j = 0; j < x.length; j++) {
            xRow.push(x[j]);
            yRow.push(y[i]);
        }
        xx.push(xRow);
        yy.push(yRow);
    }
    return {
      "xx": xx, "yy": yy
    };
}

export function multiplyArrayByScalar(arr: number[][], scalar: number): number[][] {
  return arr.map(row => row.map(value => value * scalar));
}
