"use client";

import Image from "next/image";
import { useRef } from "react";

import { ModalBackdrop, ModalClose, ModalPopup, ModalPortal, ModalRoot, ModalTitle } from "@/shared/ui/Modal";

interface LuckyDrawEnteredModalProps {
  open: boolean;
  onClose: () => void;
}

export function LuckyDrawEnteredModal({ open, onClose }: LuckyDrawEnteredModalProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  return (
    <ModalRoot
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <ModalPortal>
        <ModalBackdrop />
        {/* 열릴 때 닫기 버튼이 드러나지 않고 제목이 먼저 읽히도록 팝업에 포커스 */}
        <ModalPopup ref={popupRef} initialFocus={popupRef} className="items-center gap-3 pt-4 pb-6 outline-hidden">
          <Image src="/ticket.webp" alt="" width={60} height={60} />
          <ModalTitle>럭키드로우 자동 응모되었습니다!</ModalTitle>
          {/* 디자인에 닫기 버튼이 없어 평소엔 숨기고, 키보드 포커스 시에만 우상단에 표시 */}
          <ModalClose className="sr-only rounded-sm text-body-r-14 text-gray300 focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:right-2 focus-visible:px-2 focus-visible:py-1 focus-visible:outline-2 focus-visible:outline-primary">
            닫기
          </ModalClose>
        </ModalPopup>
      </ModalPortal>
    </ModalRoot>
  );
}
