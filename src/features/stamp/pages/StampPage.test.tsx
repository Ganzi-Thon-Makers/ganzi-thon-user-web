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
