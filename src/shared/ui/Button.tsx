"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

export const buttonVariants = cva(
  [
    "inline-flex h-12 items-center justify-center gap-2 rounded-sm px-5 py-3 text-body-sb-16 whitespace-nowrap text-white select-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary active:bg-red600 data-disabled:bg-red300",
        secondary: "bg-gray700 active:bg-gray800 data-disabled:bg-gray300",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface ButtonProps extends ComponentProps<typeof BaseButton>, VariantProps<typeof buttonVariants> {}

export function Button({ variant, className, ...props }: ButtonProps) {
  return (
    <BaseButton
      // Base UI의 className은 state를 받는 함수일 수도 있다.
      className={(state) =>
        cn(buttonVariants({ variant }), typeof className === "function" ? className(state) : className)
      }
      {...props}
    />
  );
}
