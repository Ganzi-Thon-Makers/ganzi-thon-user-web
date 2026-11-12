"use client";

import { Dialog } from "@base-ui/react/dialog";
import type { ComponentProps } from "react";

import { mergeStateClassName } from "@/shared/lib/cn";

type ModalRootProps<Payload = unknown> = Dialog.Root.Props<Payload>;
type ModalRootChangeEventDetails = Dialog.Root.ChangeEventDetails;
const ModalRoot = Dialog.Root;

type ModalBackdropProps = ComponentProps<typeof Dialog.Backdrop>;
function ModalBackdrop({ className, ...props }: ModalBackdropProps) {
  return (
    <Dialog.Backdrop
      className={mergeStateClassName(
        "fixed inset-0 z-50 bg-black90 transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-100 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

type ModalPopupProps = ComponentProps<typeof Dialog.Popup>;
function ModalPopup({ className, ...props }: ModalPopupProps) {
  return (
    <Dialog.Popup
      className={mergeStateClassName(
        "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2.5rem)] w-80 max-w-[calc(100%-2.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-auto rounded-lg bg-black px-5 pt-8 pb-5 text-center shadow-md transition-[scale,opacity] duration-100 ease-out data-starting-style:scale-98 data-starting-style:opacity-0 data-ending-style:scale-98 data-ending-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

type ModalTitleProps = ComponentProps<typeof Dialog.Title>;
function ModalTitle({ className, ...props }: ModalTitleProps) {
  return <Dialog.Title className={mergeStateClassName("text-title-sb-18 text-gray50", className)} {...props} />;
}

type ModalDescriptionProps = ComponentProps<typeof Dialog.Description>;
function ModalDescription({ className, ...props }: ModalDescriptionProps) {
  return <Dialog.Description className={mergeStateClassName("text-body-r-14 text-gray200", className)} {...props} />;
}

type ModalTriggerProps<Payload = unknown> = ComponentProps<typeof Dialog.Trigger<Payload>>;
const ModalTrigger = Dialog.Trigger;

type ModalCloseProps = ComponentProps<typeof Dialog.Close>;
const ModalClose = Dialog.Close;

type ModalPortalProps = ComponentProps<typeof Dialog.Portal>;
const ModalPortal = Dialog.Portal;

type ModalViewportProps = ComponentProps<typeof Dialog.Viewport>;
const ModalViewport = Dialog.Viewport;

export type {
  ModalRootProps,
  ModalRootChangeEventDetails,
  ModalBackdropProps,
  ModalPopupProps,
  ModalTitleProps,
  ModalDescriptionProps,
  ModalTriggerProps,
  ModalCloseProps,
  ModalPortalProps,
  ModalViewportProps,
};

export {
  ModalRoot,
  ModalBackdrop,
  ModalPopup,
  ModalTitle,
  ModalDescription,
  ModalTrigger,
  ModalClose,
  ModalPortal,
  ModalViewport,
};
