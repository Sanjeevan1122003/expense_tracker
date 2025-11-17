import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Simple Pagination Component
 */

export function Pagination({ currentPage, totalPages, onPageChange, className }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className={cn("flex items-center gap-2", className)}>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange?.(page)}
          className={cn(
            "px-3 py-1.5 text-sm rounded-md border transition-colors",
            currentPage === page
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted hover:text-foreground"
          )}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}
