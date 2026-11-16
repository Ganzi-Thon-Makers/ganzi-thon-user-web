import { screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { AppBar } from "@/shared/components/AppBar";
import { PageBoundary } from "@/shared/components/PageBoundary";
import { renderWithProviders } from "@/shared/test/render";

import * as timelineApi from "../api/timeline.api";
import { TimelinePage, TimelinePageSkeleton } from "./TimelinePage";

it("일정을 불러오는 동안 페이지 제목과 스켈레톤을 표시하고 조회 후 일정 목록으로 바꾼다", async () => {
  renderWithProviders(
    <PageBoundary header={<AppBar title="타임라인" />} fallback={<TimelinePageSkeleton />}>
      <TimelinePage />
    </PageBoundary>,
  );

  expect(screen.getByRole("heading", { name: "타임라인" })).toBeVisible();
  expect(screen.getByRole("status")).toHaveTextContent("일정을 불러오는 중");
  expect(screen.queryByRole("list")).not.toBeInTheDocument();

  expect(await screen.findByRole("list")).toBeVisible();
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(screen.getAllByRole("listitem")).toHaveLength(10);
  expect(screen.getByText("행사장 정리 및 해산")).toBeVisible();
});

it("일정 조회가 실패하면 다시 시도해 일정 목록을 불러올 수 있다", async () => {
  const getTimelineEvents = vi.spyOn(timelineApi, "getTimelineEvents").mockRejectedValueOnce(new Error("조회 실패"));

  try {
    const { user } = renderWithProviders(
      <PageBoundary fallback={<TimelinePageSkeleton />}>
        <TimelinePage />
      </PageBoundary>,
    );

    expect(await screen.findByRole("alert")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(await screen.findByRole("list")).toBeVisible();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(getTimelineEvents).toHaveBeenCalledTimes(2);
  } finally {
    getTimelineEvents.mockRestore();
  }
});
