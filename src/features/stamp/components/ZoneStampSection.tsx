"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { stampQueries } from "../api/stamp.queries";
import { ZoneStampAccordion } from "./ZoneStampAccordion";

const ZONE_SKELETON_COUNT = 3;

interface ZoneStampSectionLayoutProps {
  total: ReactNode;
  children: ReactNode;
}

function ZoneStampSectionLayout({ total, children }: ZoneStampSectionLayoutProps) {
  return (
    <section aria-labelledby="zone-stamp-title" className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-2">
        <h2 id="zone-stamp-title" className="text-body-sb-16 text-white">
          구역별 스탬프 현황
        </h2>
        {total}
      </div>
      {children}
    </section>
  );
}

export function ZoneStampSection() {
  const [{ data: myStamps }, { data: zones }] = useSuspenseQueries({
    queries: [stampQueries.mine(), stampQueries.zones()],
  });

  const collectedBoothIds = new Set(myStamps.map((stamp) => stamp.boothId));
  const boardBooths = zones.flatMap((zone) => zone.booths);
  // 스탬프판에 없는 부스의 스탬프는 세지 않아 "31/30" 같은 값이 나오지 않게 함
  const collectedCount = boardBooths.filter((booth) => collectedBoothIds.has(booth.boothId)).length;

  return (
    <ZoneStampSectionLayout
      total={
        <p className="text-caption-r-12 text-gray300">
          총 <span className="text-caption-sb-12 text-white">{collectedCount}</span>/{boardBooths.length}개
        </p>
      }
    >
      <ul className="flex flex-col gap-3">
        {zones.map((zone) => (
          <li key={zone.zoneName}>
            <ZoneStampAccordion
              zoneName={zone.zoneName}
              requiredCount={zone.requiredCount}
              stamps={zone.booths.map((booth) => ({
                id: String(booth.boothId),
                boothName: booth.boothName,
                isCollected: collectedBoothIds.has(booth.boothId),
              }))}
            />
          </li>
        ))}
      </ul>
    </ZoneStampSectionLayout>
  );
}

export function ZoneStampSectionSkeleton() {
  return (
    <ZoneStampSectionLayout total={<div className="h-4.5 w-14 animate-pulse rounded-sm bg-muted" />}>
      <div aria-busy="true" aria-label="구역별 스탬프 현황 불러오는 중" className="flex flex-col gap-3">
        {Array.from({ length: ZONE_SKELETON_COUNT }, (_, index) => (
          <div key={index} className="h-19 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </ZoneStampSectionLayout>
  );
}
