"use client";

import { Suspense } from "@suspensive/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { boothQueries } from "../api/booth.queries";
import { BoothGuideBanner } from "../components/BoothGuideBanner";
import { BoothZoneMap, BoothZoneMapSkeleton } from "../components/BoothZoneMap";

function BoothMapContent() {
  const { data: zones } = useSuspenseQuery(boothQueries.list());

  return <BoothZoneMap zones={zones} />;
}

export function BoothPage() {
  return (
    <div className="mx-auto max-w-lg">
      <BoothGuideBanner />
      <Suspense clientOnly fallback={<span hidden data-booth-map-pending className="peer" />}>
        <BoothMapContent />
      </Suspense>
      {/* 하이드레이션에서 fallback이 교체돼도 스켈레톤 DOM과 애니메이션을 유지 */}
      <div className="hidden peer-data-booth-map-pending:block">
        <BoothZoneMapSkeleton />
      </div>
    </div>
  );
}
