import { screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";

import { getMyStamps } from "../api/stamp.api";
import { makeStamp } from "../stamp.fixtures";
import { LuckyDrawProgress } from "./LuckyDrawProgress";

vi.mock("../api/stamp.api");

function makeStamps(count: number) {
  return Array.from({ length: count }, (_, index) => makeStamp(index + 1));
}

beforeEach(() => {
  localStorage.clear();
});

it("15개를 모으면 응모 안내 모달을 보여주고, 닫으면 다시 보여주지 않는다", async () => {
  vi.mocked(getMyStamps).mockResolvedValue(makeStamps(15));

  const { user, unmount } = renderWithProviders(<LuckyDrawProgress />);

  const modal = await screen.findByRole("dialog", { name: "럭키드로우 자동 응모되었습니다!" });
  await user.keyboard("{Escape}");
  await waitFor(() => expect(modal).not.toBeInTheDocument());
  unmount();

  renderWithProviders(<LuckyDrawProgress />);

  expect(await screen.findByText("응모 완료!")).toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("화면에 보이지 않는 닫기 버튼으로도 응모 안내 모달을 닫을 수 있다", async () => {
  vi.mocked(getMyStamps).mockResolvedValue(makeStamps(15));

  const { user } = renderWithProviders(<LuckyDrawProgress />);

  const modal = await screen.findByRole("dialog", { name: "럭키드로우 자동 응모되었습니다!" });
  await user.click(screen.getByRole("button", { name: "닫기" }));
  await waitFor(() => expect(modal).not.toBeInTheDocument());
});

it("15개 미만이면 응모 안내 모달을 보여주지 않는다", async () => {
  vi.mocked(getMyStamps).mockResolvedValue(makeStamps(14));

  renderWithProviders(<LuckyDrawProgress />);

  expect(await screen.findByText("1개")).toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
