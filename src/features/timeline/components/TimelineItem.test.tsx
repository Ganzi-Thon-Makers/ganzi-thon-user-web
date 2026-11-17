import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

import { TimelineItem } from "./TimelineItem";

it("클릭과 Enter 키로 일정의 상세 설명을 펼치고 접는다", async () => {
  const user = userEvent.setup();
  render(
    <TimelineItem
      id={1}
      currentTime={Date.parse("2026-11-21T00:00:00Z")}
      startTime="2026-11-21T09:00:00"
      endTime="2026-11-21T10:00:00"
      title="인사"
      description="출석 체크, 명찰·스탬프판 수령"
    />,
  );

  const trigger = screen.getByRole("button", { name: /인사/ });
  const description = screen.getByText("출석 체크, 명찰·스탬프판 수령");
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(description).not.toBeVisible();

  await user.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(description).toBeVisible();

  await user.keyboard("{Enter}");
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(description).not.toBeVisible();
});

it("자신의 시간 범위에 현재 시각이 들어갈 때만 진행 중으로 표시한다", () => {
  const event = {
    id: 1,
    startTime: "2026-11-21T10:30:00",
    endTime: "2026-11-21T11:00:00",
    title: "오프닝",
    description: "설명",
  };

  const { rerender } = render(<TimelineItem {...event} currentTime={Date.parse("2026-11-21T01:30:00Z")} />);
  const trigger = screen.getByRole("button", { name: /오프닝/ });
  expect(trigger).toHaveAttribute("aria-current", "time");

  rerender(<TimelineItem {...event} currentTime={Date.parse("2026-11-21T02:00:00Z")} />);
  expect(trigger).not.toHaveAttribute("aria-current");
});

it("설명이 없는 일정은 펼침 없이 시간과 제목을 표시한다", () => {
  render(
    <TimelineItem
      id={1}
      currentTime={Date.parse("2026-11-21T01:30:00Z")}
      startTime="2026-11-21T10:30:00"
      endTime="2026-11-21T11:00:00"
      title="오프닝"
      description={null}
    />,
  );

  expect(screen.getByText("10:30-11:00")).toBeVisible();
  expect(screen.getByText("오프닝")).toBeVisible();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
