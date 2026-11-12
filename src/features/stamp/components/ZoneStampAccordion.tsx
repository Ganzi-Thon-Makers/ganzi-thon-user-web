import { cn } from "@/shared/lib/cn";
import { Badge } from "@/shared/ui/Badge";
import { ChevronDownIcon, ChevronUpIcon } from "@/shared/ui/icons";
import { ProgressBar } from "@/shared/ui/ProgressBar";

import { StampCircle } from "./StampCircle";

interface ZoneStamp {
  id: string;
  boothName: string;
  isCollected: boolean;
}

interface ZoneStampAccordionProps {
  zoneName: string;
  requiredCount: number;
  stamps: ZoneStamp[];
}

// 펼침·키보드 조작은 네이티브 details 사용
export function ZoneStampAccordion({ zoneName, requiredCount, stamps }: ZoneStampAccordionProps) {
  const collectedCount = stamps.filter((stamp) => stamp.isCollected).length;
  const isCompleted = collectedCount >= requiredCount;
  const badgeLabel = isCompleted ? `${zoneName} 수료 완료` : `${zoneName} 수료까지 ${requiredCount - collectedCount}개`;

  return (
    <details className="group rounded-lg bg-gray800 p-4">
      <summary className="flex cursor-pointer list-none flex-col gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <span className={cn("min-w-0 truncate text-body-sb-16", isCompleted ? "text-white" : "text-gray200")}>
              {zoneName}
            </span>
            <Badge variant="secondary" size="small">
              {badgeLabel}
            </Badge>
          </span>
          <span aria-hidden className="flex shrink-0 items-end">
            <span className={isCompleted ? "text-title-sb-20 text-white" : "text-title-m-20 text-gray200"}>
              {collectedCount}
            </span>
            <span className="text-body-sb-16 text-gray400">/{stamps.length}</span>
          </span>
          <span className="sr-only">
            {stamps.length}개 중 {collectedCount}개
          </span>
          <ChevronDownIcon aria-hidden className="shrink-0 text-gray50 group-open:hidden" />
          <ChevronUpIcon aria-hidden className="hidden shrink-0 text-gray50 group-open:block" />
        </span>
        <ProgressBar aria-hidden value={collectedCount} max={stamps.length} isComplete={isCompleted} />
      </summary>
      {/* 칸 폭은 고정하고 칸 사이만 줄어들게 해 좁은 화면에서 넘침 방지 */}
      <ul className="mt-5 grid grid-cols-[repeat(4,--spacing(15))] justify-between gap-y-2">
        {stamps.map((stamp) => (
          <li key={stamp.id} className="flex w-15 flex-col items-center gap-1">
            <StampCircle isCollected={stamp.isCollected} />
            <span className="w-full text-center text-caption-m-12 wrap-break-word text-white">{stamp.boothName}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
