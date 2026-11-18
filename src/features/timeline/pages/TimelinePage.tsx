import { Suspense } from "@suspensive/react";

import { AppBar } from "@/shared/components/AppBar";
import { PageShell } from "@/shared/components/PageShell";

import { TimelineList, TimelineListSkeleton } from "../components/TimelineList";

export function TimelinePage() {
  return (
    <PageShell header={<AppBar title="타임라인" />}>
      <div className="px-1">
        <Suspense clientOnly fallback={<span hidden data-timeline-pending className="peer" />}>
          <TimelineList />
        </Suspense>
        <div className="hidden peer-data-timeline-pending:block">
          <TimelineListSkeleton />
        </div>
      </div>
    </PageShell>
  );
}
