import { screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";

import { getMyStamps, getStampZones } from "../api/stamp.api";
import { makeStamp } from "../stamp.fixtures";
import { ZoneStampSection } from "./ZoneStampSection";

vi.mock("../api/stamp.api");

const navigation = vi.hoisted(() => ({ searchParams: new URLSearchParams() }));
vi.mock("next/navigation", () => ({ useSearchParams: () => navigation.searchParams }));

beforeEach(() => {
  navigation.searchParams = new URLSearchParams();
});

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

it("방금 스탬프를 받은 부스가 주소에 있으면 그 부스의 구역만 펼친다", async () => {
  navigation.searchParams = new URLSearchParams({ stampedBooth: "5" });
  vi.mocked(getMyStamps).mockResolvedValue([makeStamp(5)]);
  vi.mocked(getStampZones).mockResolvedValue([
    { zoneName: "Zone 1", requiredCount: 3, booths: [{ boothId: 1, boothName: "1팀" }] },
    { zoneName: "Zone 2", requiredCount: 3, booths: [{ boothId: 5, boothName: "5팀" }] },
  ]);

  renderWithProviders(<ZoneStampSection />);

  expect(await screen.findByRole("button", { name: /Zone 2/ })).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("button", { name: /Zone 1/ })).toHaveAttribute("aria-expanded", "false");
});
