import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { UserIcon } from "@/shared/ui/icons";

export interface AppBarProps extends Omit<ComponentProps<"header">, "title" | "children"> {
  title: ReactNode;
  leading?: ReactNode;
  withProfile?: boolean;
}

export function AppBar({ title, leading, withProfile, className, ...props }: AppBarProps) {
  return (
    <header className={cn("flex h-12 w-full items-center bg-background text-gray50", className)} {...props}>
      {leading && <div className="grid size-12 shrink-0 place-items-center p-2">{leading}</div>}
      <h1 className="min-w-0 flex-1 truncate px-5 text-title-sb-18">{title}</h1>
      {withProfile && (
        <Link
          href="/mypage"
          className="grid h-full w-15.5 shrink-0 place-content-center justify-items-center px-1 pt-1.5 text-caption-m-10"
        >
          <UserIcon className="size-6" />
          <span>MY</span>
        </Link>
      )}
    </header>
  );
}
