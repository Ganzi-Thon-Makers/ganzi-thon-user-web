import { screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";

import { getMyStamps, getStampZones } from "../api/stamp.api";
import type { Stamp } from "../types";
import { StampPage } from "./StampPage";

vi.mock("../api/stamp.api");

function makeStamp(id: number): Stamp {
  return { id, createdAt: "2026-11-21T13:00:00", updatedAt: "2026-11-21T13:00:00", userId: 1, boothId: id };
}

it("모은 스탬프 수로 럭키드로우까지 남은 개수를 보여준다", async () => {
  vi.mocked(getMyStamps).mockResolvedValue([makeStamp(1), makeStamp(2)]);
  vi.mocked(getStampZones).mockResolvedValue([]);

  renderWithProviders(<StampPage />);

  expect(await screen.findByText("13개")).toBeInTheDocument();
});

it("스탬프를 불러오는 중에도 제목과 섹션 제목은 바로 보여준다", () => {
  vi.mocked(getMyStamps).mockReturnValue(new Promise<Stamp[]>(() => {}));
  vi.mocked(getStampZones).mockReturnValue(new Promise(() => {}));

  renderWithProviders(<StampPage />);

  expect(screen.getByRole("heading", { name: "스탬프 투어" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "구역별 스탬프 현황" })).toBeInTheDocument();
  expect(screen.getByLabelText("럭키드로우 진행 현황 불러오는 중")).toBeInTheDocument();
  expect(screen.getByLabelText("구역별 스탬프 현황 불러오는 중")).toBeInTheDocument();
});
