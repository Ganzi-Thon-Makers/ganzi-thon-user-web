import { Suspense } from "@suspensive/react";

import { PageShell } from "@/shared/components/PageShell";

import { HistoryCard } from "../components/HistoryCard";
import { LogoutButton } from "../components/LogoutButton";
import { MyPageDetails, MyPageDetailsSkeleton } from "../components/MyPageDetails";

export function MyPage() {
  return (
    <PageShell>
      <h1 className="sr-only">마이페이지</h1>
      <Suspense clientOnly fallback={<span hidden data-mypage-detail-pending className="peer" />}>
        <MyPageDetails />
      </Suspense>
      <div className="hidden peer-data-mypage-detail-pending:block">
        <MyPageDetailsSkeleton />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <HistoryCard label="투표내역" href="/projects" />
        <HistoryCard label="모은스탬프" href="/stamp" />
      </div>
      <LogoutButton />
    </PageShell>
  );
}
