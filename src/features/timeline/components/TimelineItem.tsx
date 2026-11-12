import { cn } from "@/shared/lib/cn";
import { ChevronDownIcon, ChevronUpIcon } from "@/shared/ui/icons";

interface TimelineItemProps {
  time: string;
  title: string;
  description: string;
  isOngoing?: boolean;
}

// 네이티브 details로 펼침·접힘, 키보드 조작, 펼침 상태 전달을 브라우저에 맡긴다.
export function TimelineItem({ time, title, description, isOngoing = false }: TimelineItemProps) {
  return (
    // 진행 중 테두리는 inset ring으로 그려 카드 크기를 바꾸지 않는다.
    <details className={cn("group rounded-lg bg-gray800", isOngoing && "ring-1 ring-red400 ring-inset")}>
      {/* 카드 여백까지 눌리도록 패딩을 summary에 둔다. 진행 중은 색 외에 aria-current로도 알린다. */}
      <summary
        aria-current={isOngoing ? "time" : undefined}
        className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden"
      >
        <span className="flex min-w-0 items-center gap-6">
          <span className="shrink-0 text-body-r-16 text-gray300">{time}</span>
          <span className="truncate text-body-sb-16 text-gray50 group-open:whitespace-normal">{title}</span>
        </span>
        <ChevronDownIcon aria-hidden className="shrink-0 text-gray50 group-open:hidden" />
        <ChevronUpIcon aria-hidden className="hidden shrink-0 text-gray50 group-open:block" />
      </summary>
      <p className="mx-4 -mt-1 mb-4 rounded-lg bg-gray700 px-4 py-3 text-body-r-14 text-gray300">{description}</p>
    </details>
  );
}
