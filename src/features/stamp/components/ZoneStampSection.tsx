"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { stampQueries } from "../api/stamp.queries";
import { STAMPED_AT_PARAM, STAMPED_BOOTH_PARAM } from "../stamp.routes";
import type { BoothStamp, StampZoneCode } from "../types";
import { ZoneStampAccordion } from "./ZoneStampAccordion";

const ZONE_SKELETON_COUNT = 3;
// 서버 설정 stamp.zone-completion-threshold와 같은 값. 응답에 기준값이 없어 "수료까지 N개" 계산에만 씀
const ZONE_COMPLETION_COUNT = 5;

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

  // 방금 스탬프를 받은(또는 이미 받은) 부스가 있으면 그 구역을 펼쳐 보여줌
  const searchParams = useSearchParams();
  const stampedBoothParam = searchParams.get(STAMPED_BOOTH_PARAM);
  const stampKey = `${stampedBoothParam}-${searchParams.get(STAMPED_AT_PARAM)}`;
  const stampedBoothId = stampedBoothParam === null ? null : Number(stampedBoothParam);

  const totalBooths = board.zoneStatuses.reduce((sum, zone) => sum + zone.totalBooths, 0);
  // 서버 구역별 적립 개수의 합. 스탬프판에 없는 부스의 스탬프는 포함되지 않음
  const collectedCount = board.zoneStatuses.reduce((sum, zone) => sum + zone.collectedCount, 0);

  return (
    <ZoneStampSectionLayout
      total={
        <p className="text-caption-r-12 text-gray300">
          총 <span className="text-caption-sb-12 text-white">{collectedCount}</span>/{totalBooths}개
        </p>
      }
    >
      <ul className="flex flex-col gap-3">
        {board.zoneStatuses.map((zone) => (
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
        {Array.from({ length: ZONE_SKELETON_COUNT }, (_, index) => (
          <div key={index} className="h-19 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </ZoneStampSectionLayout>
  );
}
