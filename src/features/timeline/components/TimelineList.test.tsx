import { act, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";

import { getTimetable } from "../api/timeline.api";
import type { Timeline } from "../types";
import { TimelineList } from "./TimelineList";

vi.mock("../api/timeline.api");

const timetables: Timeline[] = [
  {
    id: 1,
    startTime: "09:30",
    endTime: "10:30",
    title: "입장",
    description: "입장 안내",
  },
  {
    id: 2,
    startTime: "10:30",
    endTime: "11:00",
    title: "오프닝",
    description: "오프닝 안내",
  },
];

it("목록을 열어둔 상태에서 다음 일정이 시작되면 진행 중 표시가 바뀐다", async () => {
  vi.mocked(getTimetable).mockResolvedValueOnce({ timetables });
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-21T01:29:59Z"));

  const { queryClient, unmount } = renderWithProviders(<TimelineList />);

  try {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    const entry = screen.getByRole("button", { name: /입장/ });
    const opening = screen.getByRole("button", { name: /오프닝/ });
    expect(entry).toHaveAttribute("aria-current", "time");
    expect(opening).not.toHaveAttribute("aria-current");

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(entry).not.toHaveAttribute("aria-current");
    expect(opening).toHaveAttribute("aria-current", "time");

    unmount();
    queryClient.clear();
    expect(vi.getTimerCount()).toBe(0);
  } finally {
    vi.useRealTimers();
  }
});
