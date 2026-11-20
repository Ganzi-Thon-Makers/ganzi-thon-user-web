"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { myPageQueries } from "../api/mypage.queries";
import { ProfileSummary } from "./ProfileSummary";
import { TeamMembersCard } from "./TeamMembersCard";

export function MyPageDetails() {
  const { data } = useSuspenseQuery(myPageQueries.details());

  return (
    <div className="flex flex-col gap-5.5">
      <ProfileSummary {...data} />
      <TeamMembersCard {...data} />
    </div>
  );
}

export function MyPageDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-5.5">
      <output className="sr-only">마이페이지 정보를 불러오는 중</output>
      <div aria-hidden className="flex h-19.5 items-center gap-4">
        <div className="size-19.5 shrink-0 animate-pulse rounded-full bg-gray700" />
        <div className="flex min-w-0 flex-col gap-2">
          <div className="h-4 w-18 animate-pulse rounded-sm bg-gray700" />
          <div className="h-4 w-32 max-w-full animate-pulse rounded-sm bg-gray700" />
        </div>
      </div>
      <div aria-hidden className="flex flex-col gap-2 rounded-lg bg-gray800 px-5 py-4.25">
        <div className="h-7.25 w-12 animate-pulse rounded-sm bg-gray700" />
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex h-6 items-center">
            <div className="h-3.5 w-36 animate-pulse rounded-sm bg-gray700" />
          </div>
        ))}
      </div>
    </div>
  );
}
