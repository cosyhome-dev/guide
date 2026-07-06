import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Replace `{...}` placeholder in a template string */
export function fmt(template: string, value: string) {
  return template.replace(/\{[^}]+\}/, value);
}

/** Shared className for rendering richtext/HTML content from Strapi.
 *  Le corps du guide est en font-weight 300 (light) → la règle preflight
 *  Tailwind `strong,b { font-weight: bolder }` ne résout qu'à 400 (à peine
 *  visible). On force donc un poids absolu 600 (semibold — face DM Sans
 *  réellement chargée, poids "gras" du design system : h2/h4/h6). */
export const RICHTEXT_CLASS =
  "text-sm text-muted-foreground leading-relaxed [&>p]:mb-3 last:[&>p]:mb-0 [&_strong]:font-semibold [&_b]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_li]:mb-1 [&_a]:underline [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-2";
