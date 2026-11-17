import { cn } from "@/shared/lib/cn";
import { CollapsiblePanel, CollapsibleRoot, CollapsibleTrigger } from "@/shared/ui/Collapsible";
import { ChevronUpIcon } from "@/shared/ui/icons";

import type { TimelineEvent } from "../types";

interface TimelineItemProps extends TimelineEvent {
  currentTime: number;
}

// 목 응답의 오프셋 없는 LocalDateTime은 행사 현지 시각(KST)으로 해석한다.
function parseEventTime(time: string) {
  return Date.parse(`${time}+09:00`);
}

export function TimelineItem({ startTime, endTime, title, description, currentTime }: TimelineItemProps) {
  const start = parseEventTime(startTime);
  const end = parseEventTime(endTime);
  const isOngoing = start <= currentTime && currentTime < end;
  const time = `${startTime.slice(11, 16)}-${endTime.slice(11, 16)}`;
  const Container = description ? CollapsibleRoot : "div";
  const Header = description ? CollapsibleTrigger : "div";

  return (
    // inset ring이라 진행 중이어도 크기가 그대로다.
    <Container className={cn("group rounded-lg bg-gray800", isOngoing && "ring-1 ring-red400 ring-inset")}>
      <Header
        aria-current={isOngoing ? "time" : undefined}
        className={cn(
          "flex items-center justify-between rounded-lg p-4",
          description &&
            "w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        )}
      >
        <span className="flex min-w-0 items-center gap-6">
          <span className="shrink-0 text-body-r-16 text-gray300">{time}</span>
          <span className="text-body-sb-16 break-keep text-gray50">{title}</span>
        </span>
        {description ? (
          <ChevronUpIcon
            aria-hidden
            className="shrink-0 text-gray200 group-data-open:rotate-180 motion-safe:transition-[rotate] motion-safe:duration-200 motion-safe:ease-out"
          />
        ) : null}
      </Header>
      {description ? (
        <CollapsiblePanel
          hiddenUntilFound
          className="motion-safe:h-(--collapsible-panel-height) motion-safe:transition-[height] motion-safe:duration-200 motion-safe:ease-out motion-safe:[clip-path:inset(-0.25rem_0_0)] motion-safe:data-ending-style:h-0 motion-safe:data-starting-style:h-0"
        >
          <div className="flow-root pb-4">
            <p className="mx-4 -mt-1 rounded-lg bg-gray700 px-4 py-3 text-body-r-14 text-gray300">{description}</p>
          </div>
        </CollapsiblePanel>
      ) : null}
    </Container>
  );
}
