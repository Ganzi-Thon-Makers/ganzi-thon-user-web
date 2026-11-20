"use client";

import { ErrorBoundary, Suspense } from "@suspensive/react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { DeleteIcon } from "@/shared/ui/icons";
import { ModalBackdrop, ModalClose, ModalPopup, ModalPortal, ModalRoot } from "@/shared/ui/Modal";

import { BoothDetailError, BoothDetailLoading } from "./BoothDetailFallback";
import { BoothDetailSummary } from "./BoothDetailSummary";

export function getBoothTriggerId(boothId: number) {
  return `booth-${boothId}`;
}

interface BoothDetailModalProps {
  /** 처음부터 상세를 열어 둘 부스. 그 부스 버튼이 화면에 있어야 열린다 */
  initialBoothId?: number;
  children: ReactNode;
}

export function BoothDetailModal({ initialBoothId, children }: BoothDetailModalProps) {
  return (
    <ModalRoot<number>
      defaultOpen={initialBoothId !== undefined}
      defaultTriggerId={initialBoothId === undefined ? undefined : getBoothTriggerId(initialBoothId)}
    >
      {({ payload: boothId }) => (
        <>
          {children}
          {boothId !== undefined ? (
            <ModalPortal>
              <ModalBackdrop />
              <ModalPopup className="pointer-events-none top-[calc(50%-2.5rem)] max-h-[calc(100dvh-7.5rem)] w-[calc(100%-2*(max(--spacing(4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))+(--spacing(1))))] max-w-126 rounded-none bg-transparent p-0 text-left shadow-none">
                <ModalClose
                  aria-label="부스 상세 닫기"
                  className="pointer-events-auto flex size-12 shrink-0 items-center justify-center self-end rounded-sm pl-3 text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
                >
                  <DeleteIcon className="size-7" />
                </ModalClose>
                <QueryErrorResetBoundary key={boothId}>
                  {({ reset }) => (
                    <ErrorBoundary onReset={reset} fallback={BoothDetailError}>
                      <Suspense fallback={<BoothDetailLoading />}>
                        <BoothDetailSummary boothId={boothId} />
                      </Suspense>
                    </ErrorBoundary>
                  )}
                </QueryErrorResetBoundary>
              </ModalPopup>
            </ModalPortal>
          ) : null}
        </>
      )}
    </ModalRoot>
  );
}
