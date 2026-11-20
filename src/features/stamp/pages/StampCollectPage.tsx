"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import { isLoginRedirectPending } from "@/shared/api/client";
import { PageSkeleton } from "@/shared/components/PageSkeleton";

import { useCollectStamp } from "../hooks/use-collect-stamp";
import { clearPendingStampToken, readPendingStampToken, savePendingStampToken } from "../pending-stamp-token";
import { readStampToken, STAMP_BOARD_PATH, STAMP_COLLECT_PATH } from "../stamp.routes";

/** 휴대폰 기본 카메라로 스탬프 QR을 찍었을 때 들어오는 화면. 적립하고 스탬프판으로 보낸다 */
export function StampCollectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 토큰은 처음 한 번만 읽고 주소에서 지움. 주소에 없으면 로그인 전에 찍어 보관한 토큰을 씀
  const [token] = useState(() => readStampToken(searchParams) ?? readPendingStampToken());
  const hasStartedRef = useRef(false);
  // 적립 중에 화면을 떠났으면 응답이 와도 이동하지 않음
  const isMountedRef = useRef(false);
  const { collectStamp } = useCollectStamp();

  const startCollect = useEffectEvent(async () => {
    router.replace(STAMP_COLLECT_PATH);
    // 로그인이 풀려 로그인 화면으로 가도 로그인 뒤 이어서 적립하게 서버 응답 전까지 보관
    if (token) savePendingStampToken(token);
    const isDone = await collectStamp(token, { isCurrent: () => isMountedRef.current });
    // 로그인 화면으로 가는 중일 때만 남기고, 성공·실패와 상관없이 지움
    if (isLoginRedirectPending()) return;
    clearPendingStampToken();
    if (!isDone && isMountedRef.current) router.replace(STAMP_BOARD_PATH);
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // StrictMode에서 effect가 두 번 실행돼도 한 번만 적립
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    void startCollect();
  }, []);

  return <PageSkeleton />;
}
