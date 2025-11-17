import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

/**
 * Collapsible UI component
 * - Wraps Radix Collapsible primitives
 * - Clean, readable, and consistent with ShadCN-style structure
 */

const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
