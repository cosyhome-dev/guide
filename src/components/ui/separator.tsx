import * as React from "react";
import { cn } from "@/lib";

/**
 * Composant Separator — port pixel-perfect du Separator Shadcn ref Lovable
 * (Radix UI separator simplifié en hr natif).
 *
 * Ligne horizontale 1px border-border, full width.
 */
export type SeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn("shrink-0 border-0 border-t border-border h-0 w-full block", className)}
      style={{ lineHeight: 0, fontSize: 0 }}
      {...props}
    />
  ),
);
Separator.displayName = "Separator";
