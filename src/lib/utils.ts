import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Replace `{value}` in a template string */
export function fmt(template: string, value: string) {
  return template.replace("{value}", value)
}
