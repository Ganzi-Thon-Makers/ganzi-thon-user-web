import { screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";

import { getStampBoard } from "../api/stamp.api";
import { queueLuckyDrawNotice } from "../hooks/use-lucky-draw-notice";
import { makeStampBoard } from "../stamp.fixtures";
import { LuckyDrawProgress } from "./LuckyDrawProgress";

vi.mock("../api/stamp.api");
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams({ stampedAt: "1000" }) }));

it("럭키드로우에 응모되면 응모 안내 모달을 보여주고, 닫으면 다시 보여주지 않는다", async () => {
  vi.mocked(getStampBoard).mockResolvedValue(makeStampBoard({ collectedCount: 15 }));
  queueLuckyDrawNotice(1000);

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
  vi.mocked(getStampBoard).mockResolvedValue(makeStampBoard({ collectedCount: 15 }));
  queueLuckyDrawNotice(1000);

  const { user } = renderWithProviders(<LuckyDrawProgress />);

  const modal = await screen.findByRole("dialog", { name: "럭키드로우 자동 응모되었습니다!" });
  await waitFor(() => expect(modal).toHaveFocus());
  await user.click(screen.getByRole("button", { name: "닫기" }));
  await waitFor(() => expect(modal).not.toBeInTheDocument());
});

it("아직 응모 전이면 응모 안내 모달을 보여주지 않는다", async () => {
  vi.mocked(getStampBoard).mockResolvedValue(makeStampBoard({ collectedCount: 14 }));

  renderWithProviders(<LuckyDrawProgress />);

  expect(await screen.findByText("1개")).toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("이미 응모한 상태를 새로 조회해도 이번 적립 안내는 열지 않는다", async () => {
  vi.mocked(getStampBoard).mockResolvedValue(makeStampBoard({ collectedCount: 15 }));

  renderWithProviders(<LuckyDrawProgress />);

  expect(await screen.findByText("응모 완료!")).toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
