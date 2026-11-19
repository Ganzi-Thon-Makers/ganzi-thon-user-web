import { cn } from "@/shared/lib/cn";
import { PawLogoIcon } from "@/shared/ui/icons";

interface StampMarkProps {
  isCollected: boolean;
}

/** 부스 스탬프 한 칸. 획득하면 빨간 발바닥, 아니면 어두운 발바닥 */
export function StampMark({ isCollected }: StampMarkProps) {
  return (
    <span className="flex size-15 shrink-0 items-center justify-center">
      <PawLogoIcon
        aria-hidden
        className={cn("h-9.75 w-11.75 -rotate-12", isCollected ? "text-red400" : "text-gray700")}
      />
      <span className="sr-only">{isCollected ? "획득" : "미획득"}</span>
    </span>
  );
}
