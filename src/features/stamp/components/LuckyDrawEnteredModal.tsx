"use client";

import Image from "next/image";

import { ModalBackdrop, ModalClose, ModalPopup, ModalPortal, ModalRoot, ModalTitle } from "@/shared/ui/Modal";

interface LuckyDrawEnteredModalProps {
  open: boolean;
  onClose: () => void;
}

export function LuckyDrawEnteredModal({ open, onClose }: LuckyDrawEnteredModalProps) {
  return (
    <ModalRoot
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <ModalPortal>
        <ModalBackdrop />
        <ModalPopup className="items-center gap-3 pt-4 pb-6 outline-hidden">
          <Image src="/ticket.webp" alt="" width={60} height={60} />
          <ModalTitle>럭키드로우 자동 응모되었습니다!</ModalTitle>
          {/* 디자인에 닫기 버튼이 없어 화면에서는 숨김. 바깥 영역에 닿을 수 없는 스크린리더 사용자용 */}
          <ModalClose className="sr-only">닫기</ModalClose>
        </ModalPopup>
      </ModalPortal>
    </ModalRoot>
  );
}
