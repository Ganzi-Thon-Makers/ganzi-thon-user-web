import Link from "next/link";

import { cn } from "@/shared/lib/cn";
import { Badge } from "@/shared/ui/Badge";
import { CollapsiblePanel, CollapsibleRoot, CollapsibleTrigger } from "@/shared/ui/Collapsible";
import { ChevronDownIcon } from "@/shared/ui/icons";
import { ProgressBar } from "@/shared/ui/ProgressBar";

import { getBoothMapHref } from "../stamp.routes";
import { StampMark } from "./StampMark";

interface ZoneStamp {
  boothName: string;
  isCollected: boolean;
  boothId: number;
}

interface ZoneStampAccordionProps {
  zoneName: string;
  requiredCount: number;
  /** 수료 여부는 서버 판정을 따른다 */
  isCompleted: boolean;
  stamps: ZoneStamp[];
  defaultOpen?: boolean;
}

export function ZoneStampAccordion({
  zoneName,
  requiredCount,
  isCompleted,
  stamps,
  defaultOpen,
}: ZoneStampAccordionProps) {
  const collectedCount = stamps.filter((stamp) => stamp.isCollected).length;
  // 서버가 아직 미수료로 판정했는데 기준값이 어긋나 0개 이하가 되는 경우를 막음
  const remainingCount = Math.max(1, requiredCount - collectedCount);
  const badgeLabel = isCompleted ? `${zoneName} 수료 완료` : `${zoneName} 수료까지 ${remainingCount}개`;

  return (
    <CollapsibleRoot defaultOpen={defaultOpen} className="group rounded-lg bg-gray800 p-4">
      <CollapsibleTrigger
        nativeButton={false}
        render={<div />}
        className="flex cursor-pointer flex-col gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
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
          <ChevronDownIcon
            aria-hidden
            className="shrink-0 text-gray50 group-data-open:rotate-180 motion-safe:transition-[rotate] motion-safe:duration-200 motion-safe:ease-out"
          />
        </span>
        <ProgressBar aria-hidden value={collectedCount} max={stamps.length} isComplete={isCompleted} />
      </CollapsibleTrigger>
      {/* 타임라인과 같은 펼침 애니메이션. clip-path로 접히는 동안 넘친 칸은 가리고, 좌우·아래 포커스 링 자리는 남김 */}
      <CollapsiblePanel
        hiddenUntilFound
        className="motion-safe:h-(--collapsible-panel-height) motion-safe:transition-[height] motion-safe:duration-200 motion-safe:ease-out motion-safe:[clip-path:inset(0_-0.25rem_0)] motion-safe:data-ending-style:h-0 motion-safe:data-starting-style:h-0"
      >
        {/* 칸 폭은 고정하고 칸 사이만 줄어들게 해 좁은 화면에서 넘침 방지 */}
        <ul className="grid grid-cols-[repeat(4,--spacing(15))] justify-between gap-y-2 pt-5 pb-1">
          {stamps.map((stamp) => (
            <li key={stamp.boothId} className="w-15">
              {stamp.isCollected ? (
                <StampCell stamp={stamp} />
              ) : (
                <Link
                  href={getBoothMapHref(stamp.boothId)}
                  aria-label={`${stamp.boothName} 미획득, 부스 위치 보기`}
                  className="block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <StampCell stamp={stamp} />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </CollapsiblePanel>
    </CollapsibleRoot>
  );
}

function StampCell({ stamp }: { stamp: ZoneStamp }) {
  return (
    <span className="flex flex-col items-center gap-1">
      <StampMark isCollected={stamp.isCollected} />
      <span className="w-full text-center text-caption-m-12 wrap-break-word text-white">{stamp.boothName}</span>
    </span>
  );
}
