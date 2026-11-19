"use client";

import Image from "next/image";
import { useRef } from "react";

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

import { useQrScanner } from "../hooks/use-qr-scanner";

interface StampScanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 처리 결과가 true면 스캔을 마친 것으로 본다 */
  onScan: (text: string) => Promise<boolean>;
  onCameraError: () => void;
}

/** 스탬프 QR 스캔 모달 (Figma 875:48223). 열려 있는 동안만 카메라를 켠다 */
export function StampScanModal({ open, onOpenChange, onScan, onCameraError }: StampScanModalProps) {
  return (
    <ModalRoot open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalBackdrop />
        <ModalPopup className="h-125 overflow-hidden rounded-2xl bg-gray900 p-0">
          <CameraView onScan={onScan} onCameraError={onCameraError} />
          <div className="absolute inset-x-5 bottom-12 flex flex-col gap-1 break-keep">
            <ModalTitle className="text-white">스탬프 QR 스캔</ModalTitle>
            <ModalDescription className="text-body-r-16 text-gray100">
              QR 코드를 사각형 안에 맞춰 주세요.
            </ModalDescription>
          </div>
          <ModalClose
            aria-label="닫기"
            className="absolute top-6.25 right-5 rounded-sm text-gray200 after:absolute after:-inset-1.5 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <DeleteIcon aria-hidden className="size-8" />
          </ModalClose>
        </ModalPopup>
      </ModalPortal>
    </ModalRoot>
  );
}

interface CameraViewProps {
  onScan: (text: string) => Promise<boolean>;
  onCameraError: () => void;
}

function CameraView({ onScan, onCameraError }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useQrScanner(videoRef, { onScan, onCameraError });

  return (
    <>
      <video ref={videoRef} aria-hidden muted playsInline className="absolute inset-0 size-full object-cover" />
      {/* 스캔 영역(가운데 사각형)만 남기고 어둡게 덮는 마스크. 팝업이 좁아져도 구멍이 가운데에 오도록 중앙 기준 배치 */}
      <Image
        src="/stamp-scan-mask.svg"
        alt=""
        width={320}
        height={780}
        unoptimized
        className="absolute -top-18.75 left-1/2 h-195 w-80 max-w-none -translate-x-1/2"
      />
    </>
  );
}
