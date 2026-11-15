import { TimelinePage, TimelinePageSkeleton } from "@/features/timeline/pages/TimelinePage";
import { AppBar } from "@/shared/components/AppBar";
import { PageBoundary } from "@/shared/components/PageBoundary";

export default function Page() {
  return (
    <PageBoundary header={<AppBar title="타임라인" className="px-5" />} fallback={<TimelinePageSkeleton />}>
      <TimelinePage />
    </PageBoundary>
  );
}
