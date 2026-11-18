import { cn } from "@/shared/lib/cn";

interface StampCircleProps {
  isCollected: boolean;
}

export function StampCircle({ isCollected }: StampCircleProps) {
  return (
    <span
      className={cn(
        "flex size-15 shrink-0 items-center justify-center rounded-full bg-red500 text-caption-m-12 text-white",
        !isCollected && "opacity-30",
      )}
    >
      {isCollected ? "획득" : "미획득"}
    </span>
  );
}
