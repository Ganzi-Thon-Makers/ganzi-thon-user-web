import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import type { TimelineEvent } from "../types";
import { TimelineList } from "./TimelineList";

const events: TimelineEvent[] = [
  {
    id: 1,
    startTime: "2026-11-21T09:30:00",
    endTime: "2026-11-21T10:30:00",
    title: "입장",
    description: "입장 안내",
  },
  {
    id: 2,
    startTime: "2026-11-21T10:30:00",
    endTime: "2026-11-21T11:00:00",
    title: "오프닝",
    description: "오프닝 안내",
  },
];

it("화면에 진입한 시점의 한국 시각으로 진행 중인 일정을 표시한다", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-21T01:29:59Z"));

  try {
    const { rerender } = render(<TimelineList key="before-opening" events={events} />);

    const entry = screen.getByText("입장").closest("summary");
    const opening = screen.getByText("오프닝").closest("summary");
    expect(entry).toHaveAttribute("aria-current", "time");
    expect(opening).not.toHaveAttribute("aria-current");

    vi.setSystemTime(new Date("2026-11-21T01:30:00Z"));
    rerender(<TimelineList key="opening" events={events} />);
    expect(screen.getByText("입장").closest("summary")).not.toHaveAttribute("aria-current");
    expect(screen.getByText("오프닝").closest("summary")).toHaveAttribute("aria-current", "time");

    vi.setSystemTime(new Date("2026-11-21T02:00:00Z"));
    rerender(<TimelineList key="after-opening" events={events} />);
    expect(screen.getByText("오프닝").closest("summary")).not.toHaveAttribute("aria-current");
    expect(vi.getTimerCount()).toBe(0);
  } finally {
    vi.useRealTimers();
  }
});
