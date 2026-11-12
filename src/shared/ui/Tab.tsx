"use client";

import { Tabs } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";

import { mergeStateClassName } from "@/shared/lib/cn";

type TabRootProps = Omit<ComponentProps<typeof Tabs.Root>, "orientation">;
type TabRootChangeEventDetails = Tabs.Root.ChangeEventDetails;
function TabRoot(props: TabRootProps) {
  return <Tabs.Root {...props} orientation="horizontal" />;
}

type TabListProps = ComponentProps<typeof Tabs.List>;
function TabList({ className, ...props }: TabListProps) {
  return <Tabs.List className={mergeStateClassName("relative flex w-full", className)} {...props} />;
}

type TabTriggerProps = ComponentProps<typeof Tabs.Tab>;
const tabTriggerClassName = [
  "relative block h-12 min-w-0 flex-1 content-center truncate px-1 text-center text-body-sb-14 text-gray50",
  "focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-red500",
].join(" ");

function TabTrigger({ className, ...props }: TabTriggerProps) {
  return <Tabs.Tab className={mergeStateClassName(tabTriggerClassName, className)} {...props} />;
}

type TabIndicatorProps = ComponentProps<typeof Tabs.Indicator>;
const tabIndicatorClassName = [
  "pointer-events-none absolute bottom-0 left-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) bg-red500",
  "motion-safe:transition-[translate,width] motion-safe:duration-150 motion-safe:ease-out",
].join(" ");

function TabIndicator({ className, renderBeforeHydration = true, ...props }: TabIndicatorProps) {
  return (
    <Tabs.Indicator
      renderBeforeHydration={renderBeforeHydration}
      className={mergeStateClassName(tabIndicatorClassName, className)}
      {...props}
    />
  );
}

type TabPanelProps = ComponentProps<typeof Tabs.Panel>;
const TabPanel = Tabs.Panel;

export type {
  TabRootProps,
  TabRootChangeEventDetails,
  TabListProps,
  TabTriggerProps,
  TabIndicatorProps,
  TabPanelProps,
};

export { TabRoot, TabList, TabTrigger, TabIndicator, TabPanel };
