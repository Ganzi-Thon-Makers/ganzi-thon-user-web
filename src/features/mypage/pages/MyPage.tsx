import { Suspense } from "@suspensive/react";
import Image from "next/image";
import Link from "next/link";

import { PageShell } from "@/shared/components/PageShell";

import { MyPageDetails, MyPageDetailsSkeleton } from "../components/MyPageDetails";

interface HistoryCardProps {
  label: string;
  href: string;
}

function HistoryCard({ label, href }: HistoryCardProps) {
  return (
    <Link
      href={href}
      className="flex min-w-0 flex-col gap-3 rounded-lg bg-gray800 px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Image
        src="/button.webp"
        alt=""
        width={124}
        height={69}
        className="h-17.25 w-full max-w-31 self-end object-contain"
      />
      <span className="text-body-sb-16 wrap-anywhere break-keep text-gray50">{label}</span>
    </Link>
  );
}

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
