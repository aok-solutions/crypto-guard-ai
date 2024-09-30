import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTimestamp = (epochTimestamp: number): string => {
  const date = new Date(epochTimestamp * 1000)
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  })
}

export const formatBTC = (amount: number): string => {
  return `${(amount * 0.00000001).toFixed(8)} BTC`
}
