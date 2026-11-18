"use client";

import { Progress } from "@base-ui/react/progress";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { mergeStateClassName } from "@/shared/lib/cn";

const progressTrackVariants = cva("h-1.5 overflow-hidden rounded-full", {
  variants: {
    variant: {
      black: "bg-gray700",
      red: "bg-red400",
    },
  },
  defaultVariants: { variant: "black" },
});

// 완료 기준이 max와 다를 수 있어(구역 수료 등) Base UI의 data-complete 대신 isComplete로 결정
const progressIndicatorVariants = cva("h-full rounded-lg", {
  variants: {
    variant: {
      black: "",
      red: "",
    },
    isComplete: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    { variant: "black", isComplete: false, className: "bg-gray400" },
    { variant: "black", isComplete: true, className: "bg-white" },
    { variant: "red", isComplete: false, className: "bg-red300" },
    { variant: "red", isComplete: true, className: "bg-gray50" },
  ],
  defaultVariants: { variant: "black", isComplete: false },
});

export interface ProgressBarProps
  extends ComponentProps<typeof Progress.Root>, VariantProps<typeof progressTrackVariants> {
  isComplete?: boolean;
}

export function ProgressBar({ variant, isComplete = false, className, ...props }: ProgressBarProps) {
  return (
    <Progress.Root className={mergeStateClassName("w-full", className)} {...props}>
      <Progress.Track className={progressTrackVariants({ variant })}>
        <Progress.Indicator className={progressIndicatorVariants({ variant, isComplete })} />
      </Progress.Track>
    </Progress.Root>
  );
}
