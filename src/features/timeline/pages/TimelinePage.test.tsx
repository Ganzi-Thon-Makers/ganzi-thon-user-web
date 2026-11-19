import { screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { PageBoundary } from "@/shared/components/PageBoundary";
import { renderWithProviders } from "@/shared/test/render";

import { getTimetable } from "../api/timeline.api";
import type { TimetableResponse } from "../types";
import { TimelinePage } from "./TimelinePage";

vi.mock("../api/timeline.api");

const timetableResponse: TimetableResponse = {
  timetables: [{ id: 1, title: "참가자 입장", description: "출석 체크", startTime: "09:30", endTime: "10:30" }],
};

function renderTimelinePage() {
  return renderWithProviders(
    <PageBoundary clientOnly={false}>
      <TimelinePage />
    </PageBoundary>,
  );
}

it("일정을 불러오는 동안 제목과 로딩 안내를 표시하고 응답을 받으면 일정 목록을 보여준다", async () => {
  const { promise, resolve } = Promise.withResolvers<TimetableResponse>();
  vi.mocked(getTimetable).mockReturnValueOnce(promise);
  renderTimelinePage();

  expect(screen.getByRole("heading", { name: "타임라인" })).toBeVisible();
  expect(screen.getByRole("status")).toHaveTextContent("일정을 불러오는 중");
  expect(screen.queryByRole("list")).not.toBeInTheDocument();

  resolve(timetableResponse);
  expect(await screen.findByRole("button", { name: /참가자 입장/ })).toBeVisible();
});

it("일정 조회가 실패하면 다시 시도해 일정 목록을 불러올 수 있다", async () => {
  vi.mocked(getTimetable).mockRejectedValueOnce(new Error("조회 실패")).mockResolvedValueOnce(timetableResponse);
  const { user } = renderTimelinePage();

  expect(await screen.findByRole("alert")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "다시 시도" }));

  expect(await screen.findByRole("list")).toBeVisible();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
