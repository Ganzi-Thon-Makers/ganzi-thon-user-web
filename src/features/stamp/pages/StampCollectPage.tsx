"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import { PageSkeleton } from "@/shared/components/PageSkeleton";

import { useCollectStamp } from "../hooks/use-collect-stamp";
import { readStampToken, STAMP_BOARD_PATH, STAMP_COLLECT_PATH } from "../stamp.routes";

/** 휴대폰 기본 카메라로 스탬프 QR을 찍었을 때 들어오는 화면. 적립하고 스탬프판으로 보낸다 */
export function StampCollectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 토큰은 처음 한 번만 읽고 주소에서 지움
  const [token] = useState(() => readStampToken(searchParams));
  const hasStartedRef = useRef(false);
  const { collectStamp } = useCollectStamp();

  const startCollect = useEffectEvent(async () => {
    router.replace(STAMP_COLLECT_PATH);
    const isDone = await collectStamp(token);
    if (!isDone) router.replace(STAMP_BOARD_PATH);
  });

  useEffect(() => {
    // StrictMode에서 effect가 두 번 실행돼도 한 번만 적립
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    void startCollect();
  }, []);

  return <PageSkeleton />;
}
