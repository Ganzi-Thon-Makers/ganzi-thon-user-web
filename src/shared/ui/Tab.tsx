"use client";

import { Tabs } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

interface TabRootProps extends Omit<ComponentProps<typeof Tabs.Root>, "orientation"> {}
interface TabListProps extends Omit<ComponentProps<typeof Tabs.List>, "className"> {
  className?: string;
}
interface TabTriggerProps extends Omit<ComponentProps<typeof Tabs.Tab>, "className"> {
  className?: string;
}
interface TabIndicatorProps extends ComponentProps<typeof Tabs.Indicator> {}

function TabRoot(props: TabRootProps) {
  return <Tabs.Root {...props} orientation="horizontal" />;
}

function TabList({ className, ...props }: TabListProps) {
  return <Tabs.List className={cn("relative flex w-full", className)} {...props} />;
}

function TabTrigger({ className, ...props }: TabTriggerProps) {
  return (
    <Tabs.Tab
      className={cn(
        "relative inline-flex h-12 min-w-0 flex-1 items-center justify-center px-1 text-center text-body-sb-14 text-gray50",
        "focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-red500",
        className,
      )}
      {...props}
    />
  );
}

function TabIndicator({ className, ...props }: TabIndicatorProps) {
  return (
    <Tabs.Indicator
      className={(state) =>
        cn(
          "pointer-events-none absolute bottom-0 left-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) bg-red500",
          "motion-safe:transition-[translate,width] motion-safe:duration-150 motion-safe:ease-out",
          typeof className === "function" ? className(state) : className,
        )
      }
      {...props}
    />
  );
}

export const Tab = {
  Root: TabRoot,
  List: TabList,
  Trigger: TabTrigger,
  Panel: Tabs.Panel,
  Indicator: TabIndicator,
};
