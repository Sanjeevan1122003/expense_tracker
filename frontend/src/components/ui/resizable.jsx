import * as React from "react";
import * as ResizablePrimitive from "react-resizable-panels";
import { cn } from "../../lib/utils";

/**
 * Resizable Panels
 * - Based on `react-resizable-panels`
 */

const ResizablePanelGroup = React.forwardRef(({ className, ...props }, ref) => (
  <ResizablePrimitive.PanelGroup
    ref={ref}
    className={cn("flex h-full w-full", className)}
    {...props}
  />
));
ResizablePanelGroup.displayName = "ResizablePanelGroup";

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = React.forwardRef(({ className, ...props }, ref) => (
  <ResizablePrimitive.PanelResizeHandle
    ref={ref}
    className={cn("flex w-px cursor-col-resize bg-border transition-colors hover:bg-primary", className)}
    {...props}
  />
));
ResizableHandle.displayName = "ResizableHandle";

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
