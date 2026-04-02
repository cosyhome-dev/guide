import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Replace `{...}` placeholder in a template string */
export function fmt(template: string, value: string) {
  return template.replace(/\{[^}]+\}/, value)
}

/** Shared className for rendering richtext/HTML content from Strapi */
export const RICHTEXT_CLASS =
  "text-sm text-muted-foreground leading-relaxed [&>p]:mb-2 last:[&>p]:mb-0"
