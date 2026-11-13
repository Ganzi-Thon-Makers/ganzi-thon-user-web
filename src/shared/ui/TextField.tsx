"use client";

import { Input } from "@base-ui/react/input";
import { cva } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

import { cn, mergeStateClassName } from "@/shared/lib/cn";

const textFieldVariants = cva(
  [
    "flex min-h-12 items-center gap-2 rounded-sm bg-gray800 px-4 py-3",
    "transition-colors duration-150 ease-out motion-reduce:transition-none",
  ],
  {
    variants: {
      invalid: {
        true: "",
        false: "has-[input:focus:not([data-invalid])]:bg-gray700",
      },
    },
  },
);

export interface TextFieldProps extends ComponentProps<typeof Input> {
  containerClassName?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  errorMessage?: string;
}

export function TextField({
  className,
  containerClassName,
  leading,
  trailing,
  errorMessage,
  ...inputProps
}: TextFieldProps) {
  const isInvalid = Boolean(errorMessage);

  return (
    <div className={cn("flex w-full flex-col gap-1", containerClassName)}>
      <div className={textFieldVariants({ invalid: isInvalid })}>
        {leading && <span className="mr-1 grid size-6 shrink-0 place-items-center">{leading}</span>}
        <Input
          className={mergeStateClassName(
            "min-w-0 flex-1 text-body-r-16 text-white outline-none placeholder:text-gray500",
            className,
          )}
          {...inputProps}
        />
        {trailing && <span className="grid size-6 shrink-0 place-items-center">{trailing}</span>}
      </div>
      {isInvalid && <p className="text-body-r-14 text-red500">{errorMessage}</p>}
    </div>
  );
}
