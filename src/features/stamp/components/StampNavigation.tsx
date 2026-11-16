"use client";

import { useState } from "react";

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

  async function handleScan(text: string) {
    const isDone = await collectStamp(parseStampToken(text));
    if (isDone) setIsScanOpen(false);
    return isDone;
  }

  function handleCameraError() {
    setIsScanOpen(false);
    // TODO: 카메라를 쓸 수 없을 때의 문구가 디자인에 없어 임시 문구
    toast.error("카메라를 켜지 못했어요. 카메라 권한을 확인해 주세요.", { data: { icon: <ErrorIcon /> } });
  }

  return (
    <>
      <BottomNavigation onQrClick={() => setIsScanOpen(true)} />
      <StampScanModal
        open={isScanOpen}
        onOpenChange={setIsScanOpen}
        onScan={handleScan}
        onCameraError={handleCameraError}
      />
    </>
  );
}
