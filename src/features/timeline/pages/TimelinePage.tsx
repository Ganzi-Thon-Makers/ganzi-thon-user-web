"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { AppBar } from "@/shared/components/AppBar";
import { PageShell } from "@/shared/components/PageShell";

import { timelineQueries } from "../api/timeline.queries";
import { TimelineList, TimelineListSkeleton } from "../components/TimelineList";

function TimelinePageContent({ children }: { children: ReactNode }) {
  return <div className="px-1">{children}</div>;
}

export function TimelinePage() {
  const { data: events } = useSuspenseQuery(timelineQueries.list());

  return (
    <PageShell header={<AppBar title="타임라인" className="px-5" />}>
      <TimelinePageContent>
        <TimelineList events={events} />
      </TimelinePageContent>
    </PageShell>
  );
}

export function TimelinePageSkeleton() {
  return (
    <TimelinePageContent>
      <TimelineListSkeleton />
    </TimelinePageContent>
  );
}
