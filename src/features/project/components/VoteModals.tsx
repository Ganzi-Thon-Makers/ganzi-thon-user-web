"use client";

import { Button } from "@/shared/ui/Button";
import { CheckIcon } from "@/shared/ui/icons";
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
            {/* TODO: Figma 설명 문구가 "이번 투표를 하면 블라블라블라" 자리 문구라 확정 문구를 받으면 추가 */}
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
        {/* 조작할 요소가 없어 포커스가 팝업 자체로 감, 기본 포커스 테두리 제거 */}
        <ModalPopup className="items-center gap-3 pt-4 pb-6 outline-none">
          <CheckIcon aria-hidden className="size-15 text-red500" />
          <div className="flex flex-col gap-2">
            <ModalTitle>투표가 완료되었습니다.</ModalTitle>
            <ModalDescription>응원하는 팀에 한 표가 전달되었어요.</ModalDescription>
          </div>
        </ModalPopup>
      </ModalPortal>
    </ModalRoot>
  );
}
