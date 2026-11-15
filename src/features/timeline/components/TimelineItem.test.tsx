import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";

import { TimelineItem } from "./TimelineItem";

it("일정을 누르면 상세 설명을 펼치고 다시 누르면 접는다", async () => {
  const user = userEvent.setup();
  render(
    <TimelineItem
      id={1}
      startTime="2026-11-21T09:00:00"
      endTime="2026-11-21T10:00:00"
      title="인사"
      description="출석 체크, 명찰·스탬프판 수령"
    />,
  );

  const summary = screen.getByText("인사");
  const description = screen.getByText("출석 체크, 명찰·스탬프판 수령");
  expect(description).not.toBeVisible();

  await user.click(summary);
  expect(description).toBeVisible();

  await user.click(summary);
  expect(description).not.toBeVisible();
});

it("자신의 시간 범위에 현재 시각이 들어갈 때만 진행 중으로 표시한다", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-21T01:30:00Z"));

  try {
    const { rerender } = render(
      <TimelineItem
        id={1}
        startTime="2026-11-21T10:30:00"
        endTime="2026-11-21T11:00:00"
        title="오프닝"
        description="설명"
      />,
    );
    expect(screen.getByText("오프닝").closest("summary")).toHaveAttribute("aria-current", "time");

    rerender(
      <TimelineItem
        id={1}
        startTime="2026-11-22T10:30:00"
        endTime="2026-11-22T11:00:00"
        title="오프닝"
        description="설명"
      />,
    );
    expect(screen.getByText("오프닝").closest("summary")).not.toHaveAttribute("aria-current");
  } finally {
    vi.useRealTimers();
  }
});

it("설명이 없는 일정은 펼침 없이 시간과 제목을 표시한다", () => {
  const { container } = render(
    <TimelineItem
      id={1}
      startTime="2026-11-21T10:30:00"
      endTime="2026-11-21T11:00:00"
      title="오프닝"
      description={null}
    />,
  );

  expect(screen.getByText("10:30-11:00")).toBeVisible();
  expect(screen.getByText("오프닝")).toBeVisible();
  expect(container.querySelector("details")).not.toBeInTheDocument();
});
