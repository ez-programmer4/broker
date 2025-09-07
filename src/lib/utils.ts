import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "ETB") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "ETB" ? "USD" : currency,
    minimumFractionDigits: 0,
  }).format(price).replace("$", currency === "ETB" ? "ETB " : "$");
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}