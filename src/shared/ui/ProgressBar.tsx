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

const progressIndicatorVariants = cva("h-full rounded-lg", {
  variants: {
    variant: {
      black: "bg-gray400 data-complete:bg-white",
      red: "bg-red300 data-complete:bg-gray50",
    },
  },
  defaultVariants: { variant: "black" },
});

export interface ProgressBarProps
  extends ComponentProps<typeof Progress.Root>, VariantProps<typeof progressTrackVariants> {}

export function ProgressBar({ variant, className, ...props }: ProgressBarProps) {
  return (
    <Progress.Root className={mergeStateClassName("w-full", className)} {...props}>
      <Progress.Track className={progressTrackVariants({ variant })}>
        <Progress.Indicator className={progressIndicatorVariants({ variant })} />
      </Progress.Track>
    </Progress.Root>
  );
}
