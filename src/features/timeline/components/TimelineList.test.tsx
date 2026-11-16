import { act, render, screen } from "@testing-library/react";
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

it("목록을 열어둔 상태에서 다음 일정이 시작되면 진행 중 표시가 바뀐다", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-21T01:29:59Z"));

  try {
    const { unmount } = render(<TimelineList events={events} />);

    const entry = screen.getByText("입장").closest("summary");
    const opening = screen.getByText("오프닝").closest("summary");
    expect(entry).toHaveAttribute("aria-current", "time");
    expect(opening).not.toHaveAttribute("aria-current");

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(entry).not.toHaveAttribute("aria-current");
    expect(opening).toHaveAttribute("aria-current", "time");

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  } finally {
    vi.useRealTimers();
  }
});
