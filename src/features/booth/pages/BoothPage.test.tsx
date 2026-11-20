import { screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { PageBoundary } from "@/shared/components/PageBoundary";
import { renderWithProviders } from "@/shared/test/render";

import { getBoothZones } from "../api/booth.api";
import { boothQueries } from "../api/booth.queries";
import type { BoothListResponse } from "../types";
import { BoothPage } from "./BoothPage";

vi.mock("../api/booth.api");

const boothListResponse: BoothListResponse = {
  booths: {
    ZONE2: [
      { roomNumber: "202", boothId: 204, boothNumber: 3, teamNumber: 9 },
      { roomNumber: "201", boothId: 208, boothNumber: 8, teamNumber: 4 },
      { roomNumber: "201", boothId: 202, boothNumber: 2, teamNumber: 12 },
    ],
    ZONE1: [{ roomNumber: "104", boothId: 103, boothNumber: 1, teamNumber: 7 }],
    ZONE3: [],
  },
};

function renderBoothPage() {
  return renderWithProviders(
    <PageBoundary clientOnly={false}>
      <BoothPage />
    </PageBoundary>,
  );
}

it("부스 목록을 기다리는 동안 로딩 안내를 표시한다", async () => {
  const { promise, resolve } = Promise.withResolvers<BoothListResponse>();
  vi.mocked(getBoothZones).mockReturnValueOnce(promise);
  renderBoothPage();

  expect(screen.getByRole("status")).toHaveTextContent("부스 배치도를 불러오는 중");

  resolve(boothListResponse);

  expect(await screen.findByRole("heading", { name: "104호" })).toBeVisible();
  expect(screen.getByRole("button", { name: "7팀" })).toBeEnabled();
});

it("구역과 호실을 바꾸면 해당 부스의 팀 번호를 표시한다", async () => {
  vi.mocked(getBoothZones).mockResolvedValueOnce(boothListResponse);
  const rawResponse = structuredClone(boothListResponse);
  const { user, queryClient } = renderBoothPage();

  await user.click(await screen.findByRole("tab", { name: "Zone2" }));

  expect(screen.getByRole("tab", { name: "201호", selected: true })).toBeVisible();
  const room = screen.getByRole("tabpanel", { name: "201호" });
  expect(
    within(room)
      .getAllByRole("button")
      .map((button) => button.textContent),
  ).toEqual(["12팀", "4팀"]);
  expect(queryClient.getQueryData(boothQueries.list().queryKey)).toEqual(rawResponse);

  await user.click(screen.getByRole("tab", { name: "202호" }));

  expect(screen.getByRole("button", { name: "9팀" })).toBeVisible();
  expect(screen.queryByRole("button", { name: "12팀" })).not.toBeInTheDocument();
});

it("등록된 부스가 없으면 빈 목록을 안내한다", async () => {
  vi.mocked(getBoothZones).mockResolvedValueOnce({ booths: { ZONE1: [], ZONE2: [], ZONE3: [] } });
  renderBoothPage();

  expect(await screen.findByText("등록된 부스가 없어요")).toBeVisible();
  expect(screen.queryByRole("tab")).not.toBeInTheDocument();
});

it("부스 조회가 실패하면 다시 시도할 수 있다", async () => {
  vi.mocked(getBoothZones).mockRejectedValueOnce(new Error("조회 실패")).mockResolvedValueOnce(boothListResponse);
  const { user } = renderBoothPage();

  expect(await screen.findByRole("alert")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "다시 시도" }));

  expect(await screen.findByRole("heading", { name: "104호" })).toBeVisible();
});
