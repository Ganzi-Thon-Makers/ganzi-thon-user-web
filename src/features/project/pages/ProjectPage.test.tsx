import { screen, within } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";
import { ToastProvider } from "@/shared/ui/Toast";

import { createVote, getProjects, getVoteStatus } from "../api/project.api";
import type { Project, VoteStatus } from "../types";
import { ProjectPage } from "./ProjectPage";

vi.mock("../api/project.api");

function makeProject(id: number, title: string): Project {
  return { id, zone: "ZONE1", title, summary: `${title} 소개`, platform: "WEB", thumbnailUrl: "/thumbnail.webp" };
}

const openStatus: VoteStatus = { phase: "OPEN", opensAt: "2026-11-21T14:00:00", votedProjectId: null, myProjectId: 2 };

function renderPage() {
  return renderWithProviders(
    <ToastProvider>
      <ProjectPage />
    </ToastProvider>,
  );
}

beforeEach(() => {
  vi.mocked(getProjects).mockResolvedValue([makeProject(1, "Framey"), makeProject(2, "우리팀")]);
  vi.mocked(getVoteStatus).mockResolvedValue(openStatus);
});

it("인기투표 → 프로젝트 선택 → 확인하면 투표하고 완료 상태로 바뀐다", async () => {
  vi.mocked(createVote).mockResolvedValue({ ...openStatus, votedProjectId: 1 });
  const { user } = renderPage();

  await user.click(await screen.findByRole("button", { name: "인기투표" }));
  expect(screen.getByRole("button", { name: "투표하기" })).toBeDisabled();

  await user.click(screen.getByRole("button", { name: "Framey 선택" }));
  await user.click(screen.getByRole("button", { name: "투표하기" }));
  await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "투표하기" }));

  expect(createVote).toHaveBeenCalledWith(1, expect.anything());
  expect(await screen.findByText("투표가 완료되었습니다.")).toBeInTheDocument();
  await user.keyboard("{Escape}");
  expect(await screen.findByRole("button", { name: "투표가 완료되었어요" })).toBeDisabled();
});

it("투표에 실패하면 안내하고 완료 모달을 띄우지 않는다", async () => {
  vi.mocked(createVote).mockRejectedValue(new Error("network"));
  const { user } = renderPage();

  await user.click(await screen.findByRole("button", { name: "인기투표" }));
  await user.click(screen.getByRole("button", { name: "Framey 선택" }));
  await user.click(screen.getByRole("button", { name: "투표하기" }));
  await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "투표하기" }));

  expect(await screen.findByText("투표하지 못했어요. 잠시 후 다시 시도해 주세요.")).toBeInTheDocument();
  expect(screen.queryByText("투표가 완료되었습니다.")).not.toBeInTheDocument();
});

it("본인 팀 프로젝트를 고르면 안내하고 선택하지 않는다", async () => {
  const { user } = renderPage();

  await user.click(await screen.findByRole("button", { name: "인기투표" }));
  await user.click(screen.getByRole("button", { name: "우리팀 선택" }));

  expect(await screen.findByText("본인이 참여한 프로젝트에는 투표할 수 없어요.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "우리팀 선택" })).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByRole("button", { name: "투표하기" })).toBeDisabled();
});

it("투표 시작 전에는 시작 시각을 안내하고 버튼을 막는다", async () => {
  vi.mocked(getVoteStatus).mockResolvedValue({ ...openStatus, phase: "BEFORE" });
  renderPage();

  expect(await screen.findByRole("button", { name: "오후 2시부터 투표할 수 있어요." })).toBeDisabled();
});

it("투표가 마감되면 버튼을 막는다", async () => {
  vi.mocked(getVoteStatus).mockResolvedValue({ ...openStatus, phase: "CLOSED" });
  renderPage();

  expect(await screen.findByRole("button", { name: "투표가 마감됐어요." })).toBeDisabled();
});
