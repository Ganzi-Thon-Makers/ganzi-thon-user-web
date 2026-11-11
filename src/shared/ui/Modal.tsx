"use client";

import { Dialog } from "@base-ui/react/dialog";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type ModalBackdropProps = ComponentProps<typeof Dialog.Backdrop>;
type ModalPopupProps = ComponentProps<typeof Dialog.Popup>;
type ModalTitleProps = ComponentProps<typeof Dialog.Title>;
type ModalDescriptionProps = ComponentProps<typeof Dialog.Description>;

function modalClassName<State>(
  baseClassName: string,
  className: string | ((state: State) => string | undefined) | undefined,
) {
  return (state: State) => cn(baseClassName, typeof className === "function" ? className(state) : className);
}

function ModalBackdrop({ className, ...props }: ModalBackdropProps) {
  return (
    <Dialog.Backdrop
      className={modalClassName(
        "fixed inset-0 z-50 bg-black90 transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-100 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

function ModalPopup({ className, ...props }: ModalPopupProps) {
  return (
    <Dialog.Popup
      className={modalClassName(
        "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2.5rem)] w-80 max-w-[calc(100%-2.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-auto rounded-lg bg-black px-5 pt-8 pb-5 text-center shadow-md transition-[scale,opacity] duration-100 ease-out data-starting-style:scale-98 data-starting-style:opacity-0 data-ending-style:scale-98 data-ending-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

function ModalTitle({ className, ...props }: ModalTitleProps) {
  return <Dialog.Title className={modalClassName("text-title-sb-18 text-gray50", className)} {...props} />;
}

function ModalDescription({ className, ...props }: ModalDescriptionProps) {
  return <Dialog.Description className={modalClassName("text-body-r-14 text-gray200", className)} {...props} />;
}

export const Modal = {
  ...Dialog,
  Backdrop: ModalBackdrop,
  Popup: ModalPopup,
  Title: ModalTitle,
  Description: ModalDescription,
};
