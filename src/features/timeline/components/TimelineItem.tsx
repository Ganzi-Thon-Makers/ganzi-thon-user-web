import { cn } from "@/shared/lib/cn";
import { ChevronUpIcon } from "@/shared/ui/icons";

import type { TimelineEvent } from "../types";

import "./timeline-item.css";

interface TimelineItemProps extends TimelineEvent {
  currentTime: number;
}

// 목 응답의 오프셋 없는 LocalDateTime은 행사 현지 시각(KST)으로 해석한다.
function parseEventTime(time: string) {
  return Date.parse(`${time}+09:00`);
}

// 펼침·키보드 조작은 네이티브 details에 맡긴다.
export function TimelineItem({ startTime, endTime, title, description, currentTime }: TimelineItemProps) {
  const start = parseEventTime(startTime);
  const end = parseEventTime(endTime);
  const isOngoing = start <= currentTime && currentTime < end;
  const time = `${startTime.slice(11, 16)}-${endTime.slice(11, 16)}`;
  const Container = description ? "details" : "div";
  const Header = description ? "summary" : "div";

  return (
    // inset ring이라 진행 중이어도 크기가 그대로다.
    <Container
      className={cn(
        "group rounded-lg bg-gray800",
        description && "timeline-item-disclosure",
        isOngoing && "ring-1 ring-red400 ring-inset",
      )}
    >
      <Header
        aria-current={isOngoing ? "time" : undefined}
        className={cn(
          "flex items-center justify-between rounded-lg p-4",
          description &&
            "cursor-pointer list-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden",
        )}
      >
        <span className="flex min-w-0 items-center gap-6">
          <span className="shrink-0 text-body-r-16 text-gray300">{time}</span>
          <span className="text-body-sb-16 break-keep text-gray50">{title}</span>
        </span>
        {description ? (
          <ChevronUpIcon
            aria-hidden
            className="shrink-0 text-gray200 group-open:rotate-180 motion-safe:transition-[rotate] motion-safe:duration-200 motion-safe:ease-out"
          />
        ) : null}
      </Header>
      {description ? (
        <div className="flow-root pb-4">
          <p className="mx-4 -mt-1 rounded-lg bg-gray700 px-4 py-3 text-body-r-14 text-gray300">{description}</p>
        </div>
      ) : null}
    </Container>
  );
}
