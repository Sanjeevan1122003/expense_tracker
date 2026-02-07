import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Table Component
 * - Lightweight styled wrapper
 */

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = ({ className, ...props }) => (
  <thead className={cn("[&_tr]:border-b", className)} {...props} />
);

const TableBody = ({ className, ...props }) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);

const TableRow = ({ className, ...props }) => (
  <tr
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
);

const TableHead = ({ className, ...props }) => (
  <th
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground",
      className
    )}
    {...props}
  />
);

const TableCell = ({ className, ...props }) => (
  <td className={cn("p-2 align-middle", className)} {...props} />
);

const TableCaption = ({ className, ...props }) => (
  <caption
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
);

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
