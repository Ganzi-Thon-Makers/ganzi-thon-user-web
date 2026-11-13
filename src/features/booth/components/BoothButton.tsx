import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

// Figma의 pressed 변형은 누르는 동안의 상태로 해석
export function BoothButton({ className, children, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "flex size-18 items-center justify-center rounded-sm bg-gray600 px-2 text-center text-caption-sb-12 wrap-break-word break-keep text-gray50 active:bg-red500",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red500",
        className,
      )}
      {...props}
    >
      <span className="line-clamp-3">{children}</span>
    </button>
  );
}
