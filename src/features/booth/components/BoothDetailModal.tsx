"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { Badge } from "@/shared/ui/Badge";
import { DeleteIcon } from "@/shared/ui/icons";
import {
  ModalBackdrop,
  ModalClose,
  ModalDescription,
  ModalPopup,
  ModalPortal,
  ModalRoot,
  ModalTitle,
} from "@/shared/ui/Modal";

import type { Booth } from "../types";

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
                <article className="pointer-events-auto rounded-lg bg-gray800">
                  <div className="relative h-50.5 overflow-hidden rounded-t-lg">
                    <Image
                      src={booth.thumbnailUrl}
                      alt={`${booth.title} 썸네일`}
                      fill
                      sizes="(max-width: 544px) calc(100vw - 2.5rem), 504px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-4 px-5 pt-6 pb-5">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <ModalTitle className="min-w-0 text-title-sb-20 wrap-break-word">{booth.title}</ModalTitle>
                        <Badge>{booth.platform}</Badge>
                      </div>
                      <p className="text-body-m-16 wrap-break-word text-gray300">{booth.teamName}</p>
                    </div>
                    <ModalDescription className="text-body-m-16 wrap-break-word text-gray50">
                      {booth.summary}
                    </ModalDescription>
                  </div>
                </article>
              </ModalPopup>
            </ModalPortal>
          ) : null}
        </>
      )}
    </ModalRoot>
  );
}
