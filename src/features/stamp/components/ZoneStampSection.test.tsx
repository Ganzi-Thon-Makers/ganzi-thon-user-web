import { screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";

import { getStampBoard } from "../api/stamp.api";
import { makeStampBoard, makeZoneStatus } from "../stamp.fixtures";
import { ZoneStampSection } from "./ZoneStampSection";

vi.mock("../api/stamp.api");

const navigation = vi.hoisted(() => ({ searchParams: new URLSearchParams() }));
vi.mock("next/navigation", () => ({ useSearchParams: () => navigation.searchParams }));

beforeEach(() => {
  navigation.searchParams = new URLSearchParams();
});

it("내 스탬프를 구역별 수집 현황과 전체 개수로 보여준다", async () => {
  vi.mocked(getStampBoard).mockResolvedValue(
    makeStampBoard({
      zoneStatuses: [
        makeZoneStatus("ZONE1", [1, 2, 3, 4, 5, 6], [1, 3]),
        makeZoneStatus("ZONE2", [7, 8, 9, 10, 11, 12, 13]),
      ],
    }),
  );

  renderWithProviders(<ZoneStampSection />);

  expect(await screen.findByRole("heading", { name: "구역별 스탬프 현황" })).toBeInTheDocument();
  expect(screen.getByText("Zone 1 수료까지 3개")).toBeInTheDocument();
  expect(screen.getByText("6개 중 2개")).toBeInTheDocument();
  expect(screen.getByText("Zone 2 수료까지 5개")).toBeInTheDocument();
  expect(screen.getByText(/총/)).toHaveTextContent("총 2/13개");
});

it("방금 스탬프를 받은 부스가 주소에 있으면 그 부스의 구역만 펼친다", async () => {
  navigation.searchParams = new URLSearchParams({ stampedBooth: "5" });
  vi.mocked(getStampBoard).mockResolvedValue(
    makeStampBoard({ zoneStatuses: [makeZoneStatus("ZONE1", [1]), makeZoneStatus("ZONE2", [5], [5])] }),
  );

  renderWithProviders(<ZoneStampSection />);

  expect(await screen.findByRole("button", { name: /Zone 2/ })).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("button", { name: /Zone 1/ })).toHaveAttribute("aria-expanded", "false");
});

it("프로젝트가 없는 부스는 부스 번호로 보여준다", async () => {
  const zone = makeZoneStatus("ZONE1", [1]);
  zone.booths[0] = { ...zone.booths[0], boothName: null, boothNumber: 7 };
  vi.mocked(getStampBoard).mockResolvedValue(makeStampBoard({ zoneStatuses: [zone] }));

  const { user } = renderWithProviders(<ZoneStampSection />);
  await user.click(await screen.findByRole("button", { name: /Zone 1/ }));

  expect(screen.getByText("7번 부스")).toBeInTheDocument();
});
