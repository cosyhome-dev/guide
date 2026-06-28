import * as React from "react";
import { cn } from "@/lib";

/**
 * Composant Input — port pixel-perfect du Input Shadcn ref Lovable.
 *
 * Notes ref :
 *   text-base md:text-sm → mobile 16px (évite zoom iOS), desktop 14px
 *   ring-offset-background → décalage focus ring
 *   file:* → styles pour input type="file" (laissé, identique ref)
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
