"use client";

import QrScanner from "qr-scanner";
import { type RefObject, useEffect, useEffectEvent } from "react";

const MAX_SCANS_PER_SECOND = 10;
// 같은 QR을 비추는 동안 결과 처리가 연달아 실행되지 않도록 다음 인식까지 쉬는 시간
const SCAN_RETRY_DELAY_MS = 1500;

interface UseQrScannerOptions {
  /** 처리 결과가 true면 스캔을 마친 것으로 보고 더 인식하지 않는다 */
  onScan: (text: string) => Promise<boolean>;
  onCameraError: () => void;
}

/** video 요소에 후면 카메라를 띄우고 QR 내용을 onScan으로 넘긴다. 언마운트하면 카메라를 끈다 */
export function useQrScanner(
  videoRef: RefObject<HTMLVideoElement | null>,
  { onScan, onCameraError }: UseQrScannerOptions,
) {
  const handleScan = useEffectEvent(onScan);
  const handleCameraError = useEffectEvent(onCameraError);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isActive = true;
    let isHandling = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const scanner = new QrScanner(
      video,
      async ({ data }) => {
        if (isHandling) return;
        isHandling = true;

        // 처리 중 예외가 나도 다음 인식을 막지 않도록 실패로 봄
        const isDone = await handleScan(data).catch(() => false);
        if (isDone || !isActive) return;
        retryTimer = setTimeout(() => {
          isHandling = false;
        }, SCAN_RETRY_DELAY_MS);
      },
      {
        returnDetailedScanResult: true,
        preferredCamera: "environment",
        maxScansPerSecond: MAX_SCANS_PER_SECOND,
        // QR이 화면에 없는 프레임마다 나는 인식 실패는 무시
        onDecodeError: () => {},
      },
    );

    // 바로 정리되는 StrictMode 첫 실행에서는 카메라를 켜지 않음. 켜졌다 꺼지면 뒤 스캐너의 영상까지 멈춤
    const startTimer = setTimeout(() => {
      scanner.start().catch(() => {
        // 정리된 뒤 늦게 실패한 경우는 알리지 않음
        if (isActive) handleCameraError();
      });
    });

    return () => {
      isActive = false;
      clearTimeout(startTimer);
      clearTimeout(retryTimer);
      scanner.destroy();
    };
  }, [videoRef]);
}
