import { screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";

import { getMyStamps, getStampZones } from "../api/stamp.api";
import type { Stamp } from "../types";
import { ZoneStampSection } from "./ZoneStampSection";

vi.mock("../api/stamp.api");

function makeStamp(boothId: number): Stamp {
  return { id: boothId, createdAt: "2026-11-21T13:00:00", updatedAt: "2026-11-21T13:00:00", userId: 1, boothId };
}

it("내 스탬프를 구역별 수집 현황과 전체 개수로 보여준다", async () => {
  vi.mocked(getMyStamps).mockResolvedValue([makeStamp(1), makeStamp(3)]);
  vi.mocked(getStampZones).mockResolvedValue([
    {
      zoneName: "Zone 1",
      requiredCount: 3,
      booths: [1, 2, 3].map((boothId) => ({ boothId, boothName: `${boothId}팀` })),
    },
    {
      zoneName: "Zone 2",
      requiredCount: 3,
      booths: [4, 5, 6, 7].map((boothId) => ({ boothId, boothName: `${boothId}팀` })),
    },
  ]);

  renderWithProviders(<ZoneStampSection />);

  expect(await screen.findByRole("heading", { name: "구역별 스탬프 현황" })).toBeInTheDocument();
  expect(screen.getByText("Zone 1 수료까지 1개")).toBeInTheDocument();
  expect(screen.getByText("3개 중 2개")).toBeInTheDocument();
  expect(screen.getByText("Zone 2 수료까지 3개")).toBeInTheDocument();
  expect(screen.getByText(/총/)).toHaveTextContent("총 2/7개");
});
