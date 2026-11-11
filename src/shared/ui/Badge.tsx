import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

const badgeVariants = cva("inline-flex items-center justify-center", {
  variants: {
    variant: {
      red: "bg-red500 text-white",
      ivory: "bg-ivory200 text-black",
      secondary: "bg-gray700 text-white",
    },
    size: {
      medium: "rounded-sm px-3 py-1 text-body-sb-14",
      small: "rounded-xs px-2 py-1 text-caption-m-10",
      xsmall: "rounded-xs px-2 py-0.5 text-caption-m-10",
    },
  },
  defaultVariants: {
    variant: "red",
    size: "medium",
  },
});

export interface BadgeProps extends ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

export function Badge({ variant, size, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
