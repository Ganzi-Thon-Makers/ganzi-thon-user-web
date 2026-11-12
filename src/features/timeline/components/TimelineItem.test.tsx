import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

import { TimelineItem } from "./TimelineItem";

it("일정을 누르면 상세 설명을 펼치고 다시 누르면 접는다", async () => {
  const user = userEvent.setup();
  render(<TimelineItem time="9:00 - 10:00" title="인사" description="출석 체크, 명찰·스탬프판 수령" />);

  const summary = screen.getByText("인사");
  const description = screen.getByText("출석 체크, 명찰·스탬프판 수령");
  expect(description).not.toBeVisible();

  await user.click(summary);
  expect(description).toBeVisible();

  await user.click(summary);
  expect(description).not.toBeVisible();
});

it("진행 중인 일정만 현재 시간 항목으로 알린다", () => {
  const { rerender } = render(<TimelineItem time="10:30 - 11:00" title="오프닝" description="설명" isOngoing />);
  expect(screen.getByText("오프닝").closest("summary")).toHaveAttribute("aria-current", "time");

  rerender(<TimelineItem time="10:30 - 11:00" title="오프닝" description="설명" />);
  expect(screen.getByText("오프닝").closest("summary")).not.toHaveAttribute("aria-current");
});
