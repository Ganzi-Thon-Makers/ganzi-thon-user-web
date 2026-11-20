"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { stampQueries } from "../api/stamp.queries";
import { STAMPED_AT_PARAM, STAMPED_BOOTH_PARAM } from "../stamp.routes";
import { type BoothStamp, type StampZoneCode, ZONE_COMPLETION_COUNT } from "../types";
import { ZoneStampAccordion } from "./ZoneStampAccordion";

const ZONE_SKELETON_COUNT = 3;

const ZONE_LABELS = {
  ZONE1: "Zone 1",
  ZONE2: "Zone 2",
  ZONE3: "Zone 3",
} satisfies Record<StampZoneCode, string>;

// TODO: 프로젝트가 없는 부스는 서버가 이름을 주지 않아 부스 번호로 대신 표시함(디자인 확인 필요)
function getBoothLabel({ boothName, boothNumber }: BoothStamp) {
  if (boothName) return boothName;
  return boothNumber === null ? "부스" : `${boothNumber}번 부스`;
}

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
  const { data: board } = useSuspenseQuery(stampQueries.board());
  const myBoothQuery = useQuery(stampQueries.myBooth());
  const myBooth = myBoothQuery.isSuccess ? myBoothQuery.data : null;

  // 방금 스탬프를 받은(또는 이미 받은) 부스가 있으면 그 구역을 펼쳐 보여줌
  const searchParams = useSearchParams();
  const stampedBoothParam = searchParams.get(STAMPED_BOOTH_PARAM);
  const stampKey = `${stampedBoothParam}-${searchParams.get(STAMPED_AT_PARAM)}`;
  const stampedBoothId = stampedBoothParam === null ? null : Number(stampedBoothParam);

  const zones = board.zoneStatuses.map((zone) => {
    if (!myBooth || zone.zone !== myBooth.zone) return zone;

    const [ownBooth, duplicate] = zone.booths.filter(
      (booth) => booth.boothNumber === myBooth.boothNumber && booth.boothName === myBooth.teamName,
    );
    if (!ownBooth || duplicate) return zone;

    return { ...zone, booths: zone.booths.filter(({ boothId }) => boothId !== ownBooth.boothId) };
  });
  const booths = zones.flatMap((zone) => zone.booths);
  const totalBooths = booths.length;
  const collectedCount = booths.filter((booth) => booth.collected).length;

  return (
    <ZoneStampSectionLayout
      total={
        <p className="text-caption-r-12 text-gray300">
          총 <span className="text-caption-sb-12 text-white">{collectedCount}</span>/{totalBooths}개
        </p>
      }
    >
      <ul className="flex flex-col gap-3">
        {zones.map((zone) => (
          <li key={zone.zone}>
            <ZoneStampAccordion
              // 스탬프를 받을 때마다(같은 부스 포함) 펼침 상태를 새로 정함
              key={stampKey}
              defaultOpen={zone.booths.some((booth) => booth.boothId === stampedBoothId)}
              zoneName={ZONE_LABELS[zone.zone]}
              requiredCount={ZONE_COMPLETION_COUNT}
              isCompleted={zone.completed}
              stamps={zone.booths.map((booth) => ({
                boothName: getBoothLabel(booth),
                isCollected: booth.collected,
                boothId: booth.boothId,
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
      <div aria-busy="true" className="flex flex-col gap-3">
        <span className="sr-only">구역별 스탬프 현황 불러오는 중</span>
        {/* ZoneStampAccordion을 접은 모양(구역명·배지·개수 줄과 진행 바) */}
        {Array.from({ length: ZONE_SKELETON_COUNT }, (_, index) => (
          <div
            key={index}
            aria-hidden
            className="flex flex-col gap-3 rounded-lg bg-gray800 p-4 motion-safe:animate-pulse"
          >
            <div className="flex h-6.5 items-center gap-2">
              <div className="h-4 w-14 rounded-sm bg-gray700" />
              <div className="h-5.75 w-24 rounded-xs bg-gray700" />
              <div className="ml-auto h-5 w-10 rounded-sm bg-gray700" />
            </div>
            <div className="h-1.5 rounded-full bg-gray700" />
          </div>
        ))}
      </div>
    </ZoneStampSectionLayout>
  );
}
