"use client";

import { Popover } from "@base-ui/react/popover";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactElement } from "react";

import { mergeStateClassName } from "@/shared/lib/cn";

const tooltipVariants = cva(
  [
    "relative min-w-8 rounded-sm bg-gray700 px-2 py-1 text-caption-r-12 wrap-break-word text-gray50",
    "after:pointer-events-none after:absolute after:size-2 after:-translate-x-1/2 after:rotate-45 after:rounded-xs after:bg-gray700",
    "data-[side=bottom]:after:-top-1 data-[side=top]:after:-bottom-1",
    "origin-(--transform-origin) motion-safe:transition-[scale,opacity] motion-safe:duration-150 motion-safe:ease-out",
    "motion-safe:data-ending-style:scale-95 motion-safe:data-ending-style:opacity-0 motion-safe:data-starting-style:scale-95 motion-safe:data-starting-style:opacity-0",
  ],
  {
    variants: {
      align: {
        center: "after:left-1/2",
        start: "data-[align=end]:after:right-4 data-[align=end]:after:translate-x-1/2 data-[align=start]:after:left-4",
      },
    },
    defaultVariants: { align: "center" },
  },
);

function validateTriggerElement(element: HTMLElement | null) {
  const isNonButtonElement = element !== null && !(element instanceof HTMLButtonElement);
  if (isNonButtonElement) {
    throw new TypeError("Tooltip의 trigger는 HTML button 요소로 렌더링되어야 합니다.");
  }
}

interface TooltipProps
  extends
    Pick<
      ComponentProps<typeof Popover.Root>,
      "open" | "defaultOpen" | "onOpenChange" | "onOpenChangeComplete" | "actionsRef"
    >,
    VariantProps<typeof tooltipVariants> {
  trigger: ReactElement;
  children: string;
  side?: "top" | "bottom";
  className?: ComponentProps<typeof Popover.Popup>["className"];
}

export function Tooltip({ trigger, children, side = "top", align = "center", className, ...props }: TooltipProps) {
  const placementAlign = align ?? "center";
  const popupClassName = tooltipVariants({ align: placementAlign });

  return (
    <Popover.Root {...props}>
      <Popover.Trigger render={trigger} ref={validateTriggerElement} />
      <Popover.Portal>
        <Popover.Positioner
          side={side}
          align={placementAlign}
          sideOffset={8}
          className="z-10 w-max max-w-(--available-width)"
        >
          <Popover.Popup initialFocus={false} className={mergeStateClassName(popupClassName, className)}>
            <Popover.Description>{children}</Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
