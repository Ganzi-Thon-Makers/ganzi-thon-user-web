"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { myPageQueries } from "../api/mypage.queries";
import { ProfileSummary } from "./ProfileSummary";
import { TeamMembersCard } from "./TeamMembersCard";

export function MyPageDetails() {
  const {
    data: { profile, team },
  } = useSuspenseQuery(myPageQueries.details());

  return (
    <div className="flex flex-col gap-5.5">
      <ProfileSummary profile={profile} />
      <TeamMembersCard team={team} />
    </div>
  );
}

export function MyPageDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-5.5">
      <output className="sr-only">마이페이지 정보를 불러오는 중</output>
      <div aria-hidden className="flex h-19.5 items-center gap-4">
        <div className="size-19.5 shrink-0 rounded-full bg-gray700" />
        <div className="flex min-w-0 flex-col gap-2">
          <div className="h-4 w-18 rounded-sm bg-gray700" />
          <div className="h-4 w-32 max-w-full rounded-sm bg-gray700" />
        </div>
      </div>
      <div aria-hidden className="flex h-47.75 flex-col gap-2 rounded-lg bg-gray800 px-5 py-4.25">
        <div className="h-7.25 w-12 rounded-sm bg-gray700" />
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex h-6 items-center">
            <div className="h-3.5 w-36 rounded-sm bg-gray700" />
          </div>
        ))}
      </div>
    </div>
  );
}
