"use client";

import Image from "next/image";

import { Button } from "@/shared/ui/Button";
import {
  ModalBackdrop,
  ModalClose,
  ModalDescription,
  ModalPopup,
  ModalPortal,
  ModalRoot,
  ModalTitle,
} from "@/shared/ui/Modal";

interface VoteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  onConfirm: () => void;
}

export function VoteConfirmModal({ open, onOpenChange, isSubmitting, onConfirm }: VoteConfirmModalProps) {
  return (
    <ModalRoot open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalBackdrop />
        <ModalPopup className="gap-6">
          <div className="flex flex-col gap-2">
            <ModalTitle>이 프로젝트에게 투표할까요?</ModalTitle>
            <ModalDescription>투표는 1번만 가능하며 되돌릴 수 없습니다</ModalDescription>
          </div>
          <div className="flex gap-2">
            <ModalClose render={<Button variant="secondary" className="flex-1" />}>취소</ModalClose>
            <Button className="flex-1" disabled={isSubmitting} onClick={onConfirm}>
              투표하기
            </Button>
          </div>
        </ModalPopup>
      </ModalPortal>
    </ModalRoot>
  );
}

interface VoteCompleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VoteCompleteModal({ open, onOpenChange }: VoteCompleteModalProps) {
  return (
    <ModalRoot open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalBackdrop />
        <ModalPopup className="items-center gap-3 pt-4 pb-6 outline-hidden">
          <Image src="/check.webp" alt="" width={60} height={60} />
          <div className="flex flex-col gap-2">
            <ModalTitle>투표가 완료되었습니다.</ModalTitle>
            <ModalDescription>응원하는 팀에 한 표가 전달되었어요.</ModalDescription>
          </div>
          {/* 디자인에 닫기 버튼이 없어 화면에서는 숨김. 바깥 영역에 닿을 수 없는 스크린리더 사용자용 */}
          <ModalClose className="sr-only">닫기</ModalClose>
        </ModalPopup>
      </ModalPortal>
    </ModalRoot>
  );
}
