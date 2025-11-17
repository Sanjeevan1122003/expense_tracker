import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cn } from "../../lib/utils";

/**
 * Navigation Menu Component
 */

const NavigationMenu = NavigationMenuPrimitive.Root;
const NavigationMenuList = NavigationMenuPrimitive.List;
const NavigationMenuItem = NavigationMenuPrimitive.Item;
const NavigationMenuTrigger = NavigationMenuPrimitive.Trigger;
const NavigationMenuLink = NavigationMenuPrimitive.Link;
const NavigationMenuContent = NavigationMenuPrimitive.Content;

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuContent,
};
