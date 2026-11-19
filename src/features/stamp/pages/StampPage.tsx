"use client";

import { Suspense } from "@suspensive/react";
import Image from "next/image";

import { PageShell } from "@/shared/components/PageShell";

import { LuckyDrawProgress, LuckyDrawProgressSkeleton } from "../components/LuckyDrawProgress";
import { ZoneStampSection, ZoneStampSectionSkeleton } from "../components/ZoneStampSection";

export function StampPage() {
  return (
    <PageShell isFullBleed>
      {/* 상단 영역은 화면 끝까지 gray800으로 채움. PageShell 위 여백까지 덮도록 같은 값만큼 끌어올림 */}
      <section className="relative -mt-[max(--spacing(10),env(safe-area-inset-top,0px))] rounded-b-xl bg-gray800 px-[max(--spacing(4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))] pt-[max(--spacing(10),env(safe-area-inset-top,0px))] pb-6">
        {/* 좁은 화면에서 마스코트와 겹쳐도 글자가 위에 오도록 relative */}
        <div className="relative z-10 flex flex-col gap-1 break-keep">
          <h1 className="text-title-sb-24 text-white">스탬프 투어</h1>
          <p className="text-body-m-16 text-gray200">부스를 방문하고 스탬프를 모아보세요</p>
        </div>
        <div className="relative mt-17">
          {/* 카드 기준으로 배치해 문구 줄 수와 상관없이 아랫부분이 카드 뒤로 같은 만큼 겹침 */}
          <Image
            src="/happy-cowboy.webp"
            alt=""
            width={324}
            height={405}
            loading="eager"
            className="absolute right-0.75 bottom-full w-27 translate-y-13.5"
          />
          <div className="relative">
            <Suspense fallback={<LuckyDrawProgressSkeleton />}>
              <LuckyDrawProgress />
            </Suspense>
          </div>
        </div>
      </section>
      <div className="mt-7 px-[max(--spacing(4),env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))]">
        <Suspense fallback={<ZoneStampSectionSkeleton />}>
          <ZoneStampSection />
        </Suspense>
      </div>
    </PageShell>
  );
}
