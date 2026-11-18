import { Suspense } from "@suspensive/react";

import { PageShell } from "@/shared/components/PageShell";

import { HistoryCard } from "../components/HistoryCard";
import { MyPageDetails, MyPageDetailsSkeleton } from "../components/MyPageDetails";

export function MyPage() {
  return (
    <PageShell>
      <h1 className="sr-only">마이페이지</h1>
      <Suspense clientOnly fallback={<MyPageDetailsSkeleton />}>
        <MyPageDetails />
      </Suspense>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <HistoryCard label="투표내역" href="/projects" />
        <HistoryCard label="모은스탬프" href="/stamp" />
      </div>
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          disabled
          className="text-body-r-14 text-gray300 underline decoration-gray300 underline-offset-6"
        >
          로그아웃
        </button>
      </div>
    </PageShell>
  );
}
