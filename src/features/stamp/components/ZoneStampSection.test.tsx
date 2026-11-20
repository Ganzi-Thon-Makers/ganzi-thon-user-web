import { screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";

import { getMyStampBooth, getStampBoard } from "../api/stamp.api";
import { stampQueries } from "../api/stamp.queries";
import { makeStampBoard, makeZoneStatus } from "../stamp.fixtures";
import { ZoneStampSection } from "./ZoneStampSection";

vi.mock("../api/stamp.api");

const navigation = vi.hoisted(() => ({ searchParams: new URLSearchParams() }));
vi.mock("next/navigation", () => ({ useSearchParams: () => navigation.searchParams }));

beforeEach(() => {
  navigation.searchParams = new URLSearchParams();
  vi.mocked(getMyStampBooth).mockResolvedValue(null);
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

it("내 부스를 스탬프 칸과 전체·구역별 현황에서 제외한다", async () => {
  vi.mocked(getMyStampBooth).mockResolvedValue({ zone: "ZONE1", boothNumber: 1, teamName: "1팀" });
  const zone1 = makeZoneStatus("ZONE1", [1, 2, 3, 4, 5, 6, 7, 8]);
  const zone2 = makeZoneStatus("ZONE2", [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  const zone3 = makeZoneStatus("ZONE3", [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
  zone1.booths[1].boothNumber = 1;
  zone2.booths[0].boothNumber = 1;
  vi.mocked(getStampBoard).mockResolvedValue(makeStampBoard({ zoneStatuses: [zone1, zone2, zone3] }));

  const { user } = renderWithProviders(<ZoneStampSection />);
  const zone1Button = await screen.findByRole("button", { name: /Zone 1/ });
  const zone2Button = screen.getByRole("button", { name: /Zone 2/ });

  await waitFor(() => expect(screen.getByText(/총/)).toHaveTextContent("총 0/29개"));
  expect(zone1Button).toHaveAccessibleName(/7개 중 0개/);
  expect(zone2Button).toHaveAccessibleName(/11개 중 0개/);
  expect(screen.getByRole("button", { name: /Zone 3/ })).toHaveAccessibleName(/11개 중 0개/);

  await user.click(zone1Button);
  expect(screen.queryByRole("link", { name: /^1팀 미획득/ })).not.toBeInTheDocument();
  expect(await screen.findByRole("link", { name: /^2팀 미획득/ })).toBeInTheDocument();

  await user.click(zone2Button);
  expect(await screen.findByRole("link", { name: /^9팀 미획득/ })).toBeInTheDocument();
});

it("내 부스 조회가 실패하면 전체 부스와 현황을 보여준다", async () => {
  vi.mocked(getMyStampBooth).mockRejectedValue(new Error("내 부스 조회 실패"));
  vi.mocked(getStampBoard).mockResolvedValue(makeStampBoard({ zoneStatuses: [makeZoneStatus("ZONE1", [1, 2], [2])] }));

  const { user, queryClient } = renderWithProviders(<ZoneStampSection />);
  await waitFor(() => expect(queryClient.getQueryState(stampQueries.myBooth().queryKey)?.status).toBe("error"));
  const zoneButton = screen.getByRole("button", { name: /Zone 1/ });

  expect(screen.getByText(/총/)).toHaveTextContent("총 1/2개");
  expect(zoneButton).toHaveAccessibleName(/2개 중 1개/);
  await user.click(zoneButton);
  expect(await screen.findByRole("link", { name: /^1팀 미획득/ })).toBeInTheDocument();
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
