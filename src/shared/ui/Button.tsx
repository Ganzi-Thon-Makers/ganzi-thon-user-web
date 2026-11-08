"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap select-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "data-disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:not-data-disabled:bg-primary/90",
        secondary: "border border-border bg-surface text-foreground hover:not-data-disabled:bg-muted",
        ghost: "text-foreground hover:not-data-disabled:bg-muted",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps extends ComponentProps<typeof BaseButton>, VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <BaseButton
      // Base UI의 className은 state를 받는 함수일 수도 있다.
      className={(state) =>
        cn(buttonVariants({ variant, size }), typeof className === "function" ? className(state) : className)
      }
      {...props}
    />
  );
}
