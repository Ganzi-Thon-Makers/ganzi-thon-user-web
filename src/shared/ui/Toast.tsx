"use client";

import { Toast as BaseToast, type ToastManagerAddOptions } from "@base-ui/react/toast";
import type { ComponentProps, ReactNode } from "react";

import { mergeStateClassName } from "@/shared/lib/cn";

import "./toast.css";

type ToastType = "info" | "success" | "error";
type ToastPosition = "top-center" | "bottom-center";

interface ToastData {
  icon?: ReactNode;
}

type ToastOptions<Data extends object> = Pick<
  ToastManagerAddOptions<Data & ToastData>,
  "timeout" | "id" | "priority" | "onClose" | "onRemove" | "data"
>;

interface ToastProviderProps extends ComponentProps<typeof BaseToast.Provider> {
  position?: ToastPosition;
}

function ToastProvider({ children, position = "bottom-center", ...props }: ToastProviderProps) {
  return (
    <BaseToast.Provider {...props}>
      {children}
      <ToastList position={position} />
    </BaseToast.Provider>
  );
}

interface ToastListProps {
  position: ToastPosition;
}

function ToastList({ position }: ToastListProps) {
  const { toasts } = BaseToast.useToastManager<ToastData>();

  return (
    <BaseToast.Portal>
      <ToastViewport data-position={position}>
        {toasts.map((toast) => {
          const icon = toast.data?.icon;

          return (
            <ToastRoot key={toast.id} toast={toast}>
              <ToastContent>
                {icon && (
                  <span className="pointer-events-none inline-grid size-6 shrink-0 place-items-center">{icon}</span>
                )}
                <ToastDescription />
              </ToastContent>
            </ToastRoot>
          );
        })}
      </ToastViewport>
    </BaseToast.Portal>
  );
}

type ToastViewportProps = ComponentProps<typeof BaseToast.Viewport>;
function ToastViewport({ className, ...props }: ToastViewportProps) {
  return (
    <BaseToast.Viewport
      className={mergeStateClassName("toast-viewport fixed inset-x-5 z-50 mx-auto max-w-80", className)}
      {...props}
    />
  );
}

type ToastRootProps = ComponentProps<typeof BaseToast.Root>;
function ToastRoot({ className, ...props }: ToastRootProps) {
  return (
    <BaseToast.Root
      className={mergeStateClassName(
        "toast-root min-h-12 rounded-sm bg-black/90 text-body-m-14 text-white shadow-md",
        className,
      )}
      {...props}
    />
  );
}

type ToastContentProps = ComponentProps<typeof BaseToast.Content>;
function ToastContent({ className, ...props }: ToastContentProps) {
  return (
    <BaseToast.Content
      className={mergeStateClassName("toast-content flex min-h-12 items-center gap-2 px-4 py-3", className)}
      {...props}
    />
  );
}

type ToastDescriptionProps = ComponentProps<typeof BaseToast.Description>;
function ToastDescription({ className, ...props }: ToastDescriptionProps) {
  return (
    <BaseToast.Description
      className={mergeStateClassName("line-clamp-2 min-w-0 flex-1 wrap-anywhere", className)}
      {...props}
    />
  );
}

function useToast<Data extends object = object>() {
  const { add } = BaseToast.useToastManager<Data & ToastData>();

  function show(type: ToastType, description: string, options?: ToastOptions<Data>) {
    return add({ ...options, description, type });
  }

  return {
    info: (message: string, options?: ToastOptions<Data>) => show("info", message, options),
    success: (message: string, options?: ToastOptions<Data>) => show("success", message, options),
    error: (message: string, options?: ToastOptions<Data>) => show("error", message, options),
  };
}

export { useToast, ToastProvider };
