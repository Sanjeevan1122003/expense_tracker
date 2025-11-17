import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "../../lib/utils";

/**
 * Form Components (React Hook Form + ShadCN)
 */

const Form = ({ children, ...props }) => (
  <form className="space-y-6" {...props}>
    {children}
  </form>
);

const FormField = ({ name, control, render }) => {
  const form = useFormContext();
  return (
    <Controller
      control={control || form.control}
      name={name}
      render={({ field }) => render({ field })}
    />
  );
};

const FormItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1", className)} {...props} />
));
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn("text-sm font-medium leading-none", className)}
    {...props}
  />
));
FormLabel.displayName = LabelPrimitive.Root.displayName;

const FormControl = React.forwardRef(({ ...props }, ref) => (
  <Slot ref={ref} {...props} />
));
FormControl.displayName = "FormControl";

const FormMessage = ({ className, children, ...props }) => {
  if (!children) return null;
  return (
    <p className={cn("text-sm font-medium text-destructive", className)} {...props}>
      {children}
    </p>
  );
};
FormMessage.displayName = "FormMessage";

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage };
