'use client';

import { Toaster, toast } from 'sonner';

/**
 * Toast notification provider wrapper
 * Place this in your layout to enable toast notifications globally
 */
export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      theme="light"
      richColors
      closeButton
      expand
      duration={3000}
      visibleToasts={3}
    />
  );
}

/**
 * Toast utility functions for consistent notifications
 */

export const showToast = {
  /**
   * Show success notification
   */
  success: (message: string, options?: { description?: string; action?: string }) => {
    toast.success(message, {
      description: options?.description,
    });
  },

  /**
   * Show error notification
   */
  error: (message: string, options?: { description?: string }) => {
    toast.error(message, {
      description: options?.description,
    });
  },

  /**
   * Show info notification
   */
  info: (message: string, options?: { description?: string }) => {
    toast.info(message, {
      description: options?.description,
    });
  },

  /**
   * Show warning notification
   */
  warning: (message: string, options?: { description?: string }) => {
    toast.warning(message, {
      description: options?.description,
    });
  },

  /**
   * Show loading notification (returns dismiss function)
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },
};

/**
 * Hook to use toast notifications in components
 */
export function useToast() {
  return showToast;
}
