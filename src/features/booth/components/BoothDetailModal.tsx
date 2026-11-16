"use client";

import type { ReactNode } from "react";

import { DeleteIcon } from "@/shared/ui/icons";
import { ModalBackdrop, ModalClose, ModalPopup, ModalPortal, ModalRoot } from "@/shared/ui/Modal";

import type { Booth } from "../types";
import { BoothDetailSummary } from "./BoothDetailSummary";

interface BoothDetailModalProps {
  children: ReactNode;
}

export function BoothDetailModal({ children }: BoothDetailModalProps) {
  return (
    <ModalRoot<Booth>>
      {({ payload: booth }) => (
        <>
          {children}
          {booth ? (
            <ModalPortal>
              <ModalBackdrop />
              <ModalPopup className="pointer-events-none top-[calc(50%-2.5rem)] max-h-[calc(100dvh-7.5rem)] w-[calc(100%-2*(max(--spacing(4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))+(--spacing(1))))] max-w-126 rounded-none bg-transparent p-0 text-left shadow-none">
                <ModalClose
                  aria-label="부스 상세 닫기"
                  className="pointer-events-auto flex size-12 shrink-0 items-center justify-center self-end rounded-sm pl-3 text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
                >
                  <DeleteIcon className="size-7" />
                </ModalClose>
                <BoothDetailSummary booth={booth} />
              </ModalPopup>
            </ModalPortal>
          ) : null}
        </>
      )}
    </ModalRoot>
  );
}
