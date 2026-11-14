"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { stampQueries } from "../api/stamp.queries";
import { useLuckyDrawNotice } from "../hooks/use-lucky-draw-notice";
import { LuckyDrawCard } from "./LuckyDrawCard";
import { LuckyDrawEnteredModal } from "./LuckyDrawEnteredModal";

// 기능 명세서 STAMP-01-1: 15개를 모으면 럭키드로우 자동 응모
const LUCKY_DRAW_GOAL_COUNT = 15;

export function LuckyDrawProgress() {
  const { data: stamps } = useSuspenseQuery(stampQueries.mine());
  const notice = useLuckyDrawNotice(stamps.length >= LUCKY_DRAW_GOAL_COUNT);

  return (
    <>
      <LuckyDrawCard collectedCount={stamps.length} goalCount={LUCKY_DRAW_GOAL_COUNT} />
      <LuckyDrawEnteredModal open={notice.isOpen} onClose={notice.dismiss} />
    </>
  );
}

// 뒤에 겹친 마스코트가 비치지 않게 불투명 바탕 위에서 깜빡임
export function LuckyDrawProgressSkeleton() {
  return (
    <div aria-busy="true" aria-label="럭키드로우 진행 현황 불러오는 중" className="rounded-lg bg-background">
      <div className="h-22.75 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
