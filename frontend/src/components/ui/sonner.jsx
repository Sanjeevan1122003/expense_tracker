"use client";

import { Toaster as Sonner } from "sonner";

/**
 * Sonner Toast Provider
 * - Handles app-level toast notifications
 */

export const Toaster = () => (
  <Sonner
    position="top-right"
    richColors
    closeButton
    theme="system"
    toastOptions={{
      style: { borderRadius: "8px", padding: "12px" },
    }}
  />
);
