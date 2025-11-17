import * as React from "react";
import * as OTPInputPrimitive from "input-otp";
import { cn } from "../../lib/utils";

/**
 * OTP Input Component
 */

const InputOTP = React.forwardRef(({ className, ...props }, ref) => (
  <OTPInputPrimitive.Root
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-1", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef(({ className, index, ...props }, ref) => (
  <OTPInputPrimitive.Slot
    ref={ref}
    index={index}
    className={cn(
      "flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-sm " +
        "font-medium ring-offset-background transition-all " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
        "data-[state=selected]:ring-2 data-[state=selected]:ring-ring",
      className
    )}
    {...props}
  />
));
InputOTPSlot.displayName = "InputOTPSlot";

export { InputOTP, InputOTPGroup, InputOTPSlot };
