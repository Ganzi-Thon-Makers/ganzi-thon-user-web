"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";

import { PageShell } from "@/shared/components/PageShell";

import { stampQueries } from "../api/stamp.queries";
import { LuckyDrawCard } from "../components/LuckyDrawCard";
import { ZoneStampSection } from "../components/ZoneStampSection";

// 기능 명세서 STAMP-01-1: 15개를 모으면 럭키드로우 자동 응모
const LUCKY_DRAW_GOAL_COUNT = 15;

export function StampPage() {
  const { data: stamps } = useSuspenseQuery(stampQueries.mine());

  return (
    <PageShell>
      {/* TODO: Figma(875:48177)는 화면 끝까지 꽉 찬 gray800 상단 영역이다. 페이지 여백 안에 두면서 배경을 뺐는데, 디자인과 확인 필요 */}
      <section className="relative">
        {/* 좁은 화면에서 마스코트와 겹쳐도 글자가 위에 오도록 relative */}
        <div className="relative flex flex-col gap-1 break-keep">
          <h1 className="text-title-sb-24 text-white">스탬프 투어</h1>
          <p className="text-body-m-16 text-gray200">부스를 방문하고 스탬프를 모아보세요</p>
        </div>
        <div className="relative mt-17">
          {/* 카드 기준으로 배치해 문구 줄 수와 상관없이 아랫부분이 카드 뒤로 같은 만큼 겹침 */}
          <div aria-hidden className="absolute right-0 bottom-full h-33.5 w-28.25 translate-y-9.25 overflow-hidden">
            <Image src="/happy.webp" alt="" width={237} height={333} loading="eager" className="w-full -scale-x-100" />
          </div>
          <div className="relative">
            <LuckyDrawCard collectedCount={stamps.length} goalCount={LUCKY_DRAW_GOAL_COUNT} />
          </div>
        </div>
      </section>
      <div className="mt-7">
        <ZoneStampSection />
      </div>
    </PageShell>
  );
}
