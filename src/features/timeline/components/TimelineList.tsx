"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { timelineQueries } from "../api/timeline.queries";
import { useNow } from "../hooks/use-now";
import { TimelineItem } from "./TimelineItem";

export function TimelineList() {
  const {
    data: { timetables },
  } = useSuspenseQuery(timelineQueries.list());

  const currentTime = useNow();

  if (timetables.length === 0) {
    return <p className="py-4 text-body-r-16 text-gray300">등록된 일정이 없어요.</p>;
  }

  return (
    <ol className="flex list-decimal flex-col gap-2 marker:text-transparent">
      {timetables.map((event) => (
        <li key={event.id}>
          <TimelineItem {...event} currentTime={currentTime} />
        </li>
      ))}
    </ol>
  );
}

const SKELETON_ROW_COUNT = 10;

export function TimelineListSkeleton() {
  return (
    <div className="flex flex-col gap-2 motion-safe:animate-pulse">
      <output className="sr-only">일정을 불러오는 중</output>
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <div key={index} className="flex h-14 items-center gap-4 rounded-lg bg-gray800 p-4">
          <div className="h-3 w-22 shrink-0 rounded-sm bg-gray700" />
          <div className="h-3 w-32 rounded-sm bg-gray700" />
        </div>
      ))}
    </div>
  );
}
