import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Menubar Component
 */

const Menubar = MenubarPrimitive.Root;
const MenubarTrigger = MenubarPrimitive.Trigger;
const MenubarMenu = MenubarPrimitive.Menu;
const MenubarPortal = MenubarPrimitive.Portal;
const MenubarGroup = MenubarPrimitive.Group;
const MenubarSub = MenubarPrimitive.Sub;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

const MenubarContent = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md " +
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
        className
      )}
      {...props}
    />
  </MenubarPrimitive.Portal>
));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none " +
        "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarPortal,
  MenubarGroup,
  MenubarSub,
  MenubarRadioGroup,
};
