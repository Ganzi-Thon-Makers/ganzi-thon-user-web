"use client";

import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/cn";

import { buttonVariants } from "./Button";

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & VariantProps<typeof buttonVariants>;

export function ButtonLink({ className, variant, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant }), className)} {...props} />;
}
