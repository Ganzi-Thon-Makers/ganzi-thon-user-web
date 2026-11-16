"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import type { ComponentProps } from "react";

// 동작만 제공한다. 모양과 펼침 애니메이션(--collapsible-panel-height)은 사용처가 정한다
type CollapsibleRootProps = ComponentProps<typeof Collapsible.Root>;
const CollapsibleRoot = Collapsible.Root;

type CollapsibleTriggerProps = ComponentProps<typeof Collapsible.Trigger>;
const CollapsibleTrigger = Collapsible.Trigger;

type CollapsiblePanelProps = ComponentProps<typeof Collapsible.Panel>;
const CollapsiblePanel = Collapsible.Panel;

export type { CollapsibleRootProps, CollapsibleTriggerProps, CollapsiblePanelProps };

export { CollapsibleRoot, CollapsibleTrigger, CollapsiblePanel };
