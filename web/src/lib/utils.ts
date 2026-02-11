import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "万";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

export function formatPercent(num: number): string {
  return (num * 100).toFixed(1) + "%";
}

export function formatMoney(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(0) + "万元";
  }
  return num.toLocaleString() + "元";
}
