import * as React from "react";
import { cn } from "@/lib";

/**
 * Composant Button — port pixel-perfect du Button Shadcn ref Lovable.
 * Variant + size default uniquement (les seuls utilisés dans le guide).
 *
 * Classes exactes Shadcn default + size default :
 *   inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md
 *   text-sm font-medium transition-colors focus-visible:outline-none
 *   focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
 *   disabled:pointer-events-none disabled:opacity-50
 *   bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2
 */
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", ...props }, ref) => (
    <button
      type={type}
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
