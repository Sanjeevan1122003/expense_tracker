import { cn } from "../../lib/utils";

/**
 * Skeleton Loader
 * - Simple animated placeholder
 */

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
