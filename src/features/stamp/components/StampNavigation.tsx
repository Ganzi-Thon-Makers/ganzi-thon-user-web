"use client";

import { useRef, useState } from "react";

import { BottomNavigation } from "@/shared/ui/BottomNavigation";
import { ErrorIcon } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";

import { useCollectStamp } from "../hooks/use-collect-stamp";
import { parseStampToken } from "../stamp.routes";
import { StampScanModal } from "./StampScanModal";

export function StampNavigation() {
  const [isScanOpen, setIsScanOpen] = useState(false);
  const { collectStamp } = useCollectStamp();
  const toast = useToast();
  // 모달을 열고 닫을 때마다 바뀌어, 이전 스캔의 늦은 응답이 지금 화면을 바꾸지 않게 함
  const scanSessionRef = useRef(0);
  // 서버가 거절한 토큰. 같은 QR을 비추는 동안 다시 요청하지 않고, 모달을 다시 열면 비움
  const rejectedTokenRef = useRef<string | null>(null);

  function handleOpenChange(open: boolean) {
    scanSessionRef.current += 1;
    rejectedTokenRef.current = null;
    setIsScanOpen(open);
  }

  async function handleScan(text: string) {
    const session = scanSessionRef.current;
    const isCurrentSession = () => scanSessionRef.current === session;
    const token = parseStampToken(text);
    // 거절된 토큰은 요청 없이 인식 실패 안내만 다시 보여줌
    const isDone = await collectStamp(token === rejectedTokenRef.current ? null : token, {
      isCurrent: isCurrentSession,
      onRejected: () => {
        if (isCurrentSession()) rejectedTokenRef.current = token;
      },
    });
    if (isDone && isCurrentSession()) setIsScanOpen(false);
    return isDone;
  }

  function handleCameraError() {
    handleOpenChange(false);
    // TODO: 카메라를 쓸 수 없을 때의 문구가 디자인에 없어 임시 문구
    toast.error("카메라를 켜지 못했어요. 카메라 권한을 확인해 주세요.", { data: { icon: <ErrorIcon /> } });
  }

  return (
    <>
      <BottomNavigation onQrClick={() => handleOpenChange(true)} />
      <StampScanModal
        open={isScanOpen}
        onOpenChange={handleOpenChange}
        onScan={handleScan}
        onCameraError={handleCameraError}
      />
    </>
  );
}
