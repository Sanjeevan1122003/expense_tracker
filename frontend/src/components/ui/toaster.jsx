"use client";

import { useToast } from "../../hooks/use-toast";
import { Toast, ToastAction, ToastClose, ToastProvider, ToastViewport } from "../../components/ui/toast";

/**
 * Toaster Component
 * - Displays toast messages across app
 */

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <div className="font-semibold">{title}</div>}
            {description && <div className="text-sm opacity-90">{description}</div>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

