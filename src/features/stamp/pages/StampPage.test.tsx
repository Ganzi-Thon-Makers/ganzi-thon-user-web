import { screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";

import { getMyStampBooth, getStampBoard } from "../api/stamp.api";
import { makeStampBoard } from "../stamp.fixtures";
import { StampPage } from "./StampPage";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams() }));
vi.mock("../api/stamp.api");

beforeEach(() => {
  vi.mocked(getMyStampBooth).mockResolvedValue(null);
});

it("모은 스탬프 수로 럭키드로우까지 남은 개수를 보여준다", async () => {
  vi.mocked(getStampBoard).mockResolvedValue(makeStampBoard({ collectedCount: 2 }));

  renderWithProviders(<StampPage />);

  expect(await screen.findByText("13개")).toBeInTheDocument();
});

it("스탬프를 불러오는 중에도 제목과 섹션 제목은 바로 보여준다", () => {
  vi.mocked(getStampBoard).mockReturnValue(new Promise(() => {}));

  renderWithProviders(<StampPage />);

  expect(screen.getByRole("heading", { name: "스탬프 투어" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "구역별 스탬프 현황" })).toBeInTheDocument();
  expect(screen.getByText("럭키드로우 진행 현황 불러오는 중")).toBeInTheDocument();
  expect(screen.getByText("구역별 스탬프 현황 불러오는 중")).toBeInTheDocument();
});
