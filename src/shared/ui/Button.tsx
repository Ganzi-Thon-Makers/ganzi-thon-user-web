"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { mergeStateClassName } from "@/shared/lib/cn";

export const buttonVariants = cva(
  [
    "inline-flex h-12 items-center justify-center gap-2 rounded-sm px-5 py-3 text-body-sb-16 whitespace-nowrap text-white select-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "transition-[background-color] duration-100 ease-out motion-reduce:transition-none",
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
  return <BaseButton className={mergeStateClassName(buttonVariants({ variant }), className)} {...props} />;
}
