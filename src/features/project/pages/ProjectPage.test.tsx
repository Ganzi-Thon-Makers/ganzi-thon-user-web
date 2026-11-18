import { screen, waitFor, within } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";
import { ToastProvider } from "@/shared/ui/Toast";

import { createVote, getMyProject, getProjects, getVotePeriod } from "../api/project.api";
import type { Project, ProjectDetail, VotePeriod } from "../types";
import { ProjectPage } from "./ProjectPage";

vi.mock("../api/project.api");

function makeProject(id: number, title: string, isVoted = false): Project {
  return { id, title, summary: `${title} 소개`, platform: "WEB", thumbnailUrl: "/thumbnail.webp", isVoted };
}

const openPeriod: VotePeriod = { status: "IN_PROGRESS", startTime: "2026-11-21T14:00:00" };
const myProject: ProjectDetail = {
  id: 2,
  title: "우리팀",
  teamName: "간지팀",
  summary: "우리팀 소개",
  description: "",
  serviceUrl: null,
  thumbnailUrl: "/thumbnail.webp",
  techStack: "",
  platform: "WEB",
  members: [],
};

/** ky HTTPError처럼 판별되는 서버 에러 (feature에서 ky를 직접 쓰지 않으려고 형태만 맞춤) */
function serverError(status: number, code: string) {
  return Object.assign(new Error(code), { name: "HTTPError", isKyError: true, response: { status }, data: { code } });
}

// 투표 상태는 목록과 따로 불러와서, 받아오기 전에는 버튼이 비활성이다. 하단 버튼은 포커스를 잃지 않도록 aria-disabled로 막음
async function findEnabledVoteButton() {
  const button = await screen.findByRole("button", { name: "인기투표" });
  await waitFor(() => expect(button).toHaveAttribute("aria-disabled", "false"));
  return button;
}

function renderPage() {
  return renderWithProviders(
    <ToastProvider>
      <ProjectPage />
    </ToastProvider>,
  );
}

beforeEach(() => {
  vi.mocked(getProjects).mockResolvedValue({ ZONE1: [makeProject(1, "Framey"), makeProject(2, "우리팀")] });
  vi.mocked(getVotePeriod).mockResolvedValue(openPeriod);
  vi.mocked(getMyProject).mockResolvedValue(myProject);
});

it("인기투표 → 프로젝트 선택 → 확인하면 투표하고 완료 상태로 바뀐다", async () => {
  vi.mocked(createVote).mockImplementation(async () => {
    vi.mocked(getProjects).mockResolvedValue({ ZONE1: [makeProject(1, "Framey", true), makeProject(2, "우리팀")] });
  });
  const { user } = renderPage();

  await user.click(await findEnabledVoteButton());
  expect(screen.getByRole("button", { name: "투표하기" })).toHaveAttribute("aria-disabled", "true");

  await user.click(screen.getByRole("button", { name: "Framey 선택" }));
  await user.click(screen.getByRole("button", { name: "투표하기" }));
  const dialog = await screen.findByRole("dialog");
  expect(within(dialog).getByText("투표는 1번만 가능하며 되돌릴 수 없습니다")).toBeInTheDocument();
  await user.click(within(dialog).getByRole("button", { name: "투표하기" }));

  expect(createVote).toHaveBeenCalledWith(1, expect.anything());
  expect(await screen.findByText("투표가 완료되었습니다.")).toBeInTheDocument();
  await user.keyboard("{Escape}");
  expect(await screen.findByRole("button", { name: "투표가 완료되었어요" })).toHaveAttribute("aria-disabled", "true");
});

it("투표 모드에서 뒤로 가면 선택을 지우고 목록으로 돌아간다", async () => {
  const { user } = renderPage();

  await user.click(await findEnabledVoteButton());
  expect(screen.queryByRole("link", { name: "MY" })).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Framey 선택" }));
  await user.click(screen.getByRole("button", { name: "투표 그만하기" }));

  expect(screen.getByRole("heading", { level: 1, name: "프로젝트" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "인기투표" })).toHaveAttribute("aria-disabled", "false");
  expect(screen.getByRole("button", { name: "인기투표" })).toHaveFocus();
  expect(screen.queryByRole("button", { name: "Framey 선택" })).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "인기투표" }));
  expect(screen.getByRole("button", { name: "Framey 선택" })).toHaveAttribute("aria-pressed", "false");
});

it("투표에 실패하면 안내하고 완료 모달을 띄우지 않는다", async () => {
  vi.mocked(createVote).mockRejectedValue(new Error("network"));
  const { user } = renderPage();

  await user.click(await findEnabledVoteButton());
  await user.click(screen.getByRole("button", { name: "Framey 선택" }));
  await user.click(screen.getByRole("button", { name: "투표하기" }));
  await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "투표하기" }));

  expect(await screen.findByText("투표하지 못했어요. 잠시 후 다시 시도해 주세요.")).toBeInTheDocument();
  expect(screen.queryByText("투표가 완료되었습니다.")).not.toBeInTheDocument();
});

it("서버가 본인 팀 투표로 거절하면 본인 팀 안내를 보여 준다", async () => {
  vi.mocked(getMyProject).mockResolvedValue(null);
  vi.mocked(createVote).mockRejectedValue(serverError(400, "VOTE_OWN_PROJECT"));
  const { user } = renderPage();

  await user.click(await findEnabledVoteButton());
  await user.click(screen.getByRole("button", { name: "Framey 선택" }));
  await user.click(screen.getByRole("button", { name: "투표하기" }));
  await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "투표하기" }));

  expect(await screen.findByText("본인이 참여한 프로젝트에는 투표할 수 없어요.")).toBeInTheDocument();
});

it("소속 팀이 없으면 어떤 프로젝트든 고를 수 있다", async () => {
  vi.mocked(getMyProject).mockResolvedValue(null);
  const { user } = renderPage();

  await user.click(await findEnabledVoteButton());
  await user.click(screen.getByRole("button", { name: "우리팀 선택" }));

  expect(screen.getByRole("button", { name: "우리팀 선택" })).toHaveAttribute("aria-pressed", "true");
});

it("본인 팀 프로젝트를 고르면 안내하고 선택하지 않는다", async () => {
  const { user } = renderPage();

  await user.click(await findEnabledVoteButton());
  await user.click(screen.getByRole("button", { name: "우리팀 선택" }));

  expect(await screen.findByText("본인이 참여한 프로젝트에는 투표할 수 없어요.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "우리팀 선택" })).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByRole("button", { name: "투표하기" })).toHaveAttribute("aria-disabled", "true");
});

it("투표 시작 전에는 시작 시각을 안내하고 버튼을 막는다", async () => {
  vi.mocked(getVotePeriod).mockResolvedValue({ ...openPeriod, status: "NOT_STARTED" });
  renderPage();

  expect(await screen.findByRole("button", { name: "오후 2시부터 투표할 수 있어요." })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
});

it("투표가 마감되면 버튼을 막는다", async () => {
  vi.mocked(getVotePeriod).mockResolvedValue({ ...openPeriod, status: "ENDED" });
  renderPage();

  expect(await screen.findByRole("button", { name: "투표가 마감됐어요." })).toHaveAttribute("aria-disabled", "true");
});

it("관리자가 투표를 닫으면(일시중지) 마감과 같이 막는다", async () => {
  vi.mocked(getVotePeriod).mockResolvedValue({ ...openPeriod, status: "PAUSED" });
  renderPage();

  expect(await screen.findByRole("button", { name: "투표가 마감됐어요." })).toHaveAttribute("aria-disabled", "true");
});

it("이미 투표했으면 완료 상태로 막는다", async () => {
  vi.mocked(getProjects).mockResolvedValue({ ZONE1: [makeProject(1, "Framey", true)] });
  renderPage();

  expect(await screen.findByRole("button", { name: "투표가 완료되었어요" })).toHaveAttribute("aria-disabled", "true");
});

it("투표 상태를 불러오지 못해도 목록은 보여 준다", async () => {
  vi.mocked(getVotePeriod).mockRejectedValue(new Error("network"));
  renderPage();

  expect(await screen.findByText("Framey")).toBeInTheDocument();
  expect(await screen.findByRole("button", { name: "투표 정보를 불러오지 못했어요." })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
});

it("투표 실패 후 마감으로 확인되면 투표 모드를 끈다", async () => {
  vi.mocked(createVote).mockRejectedValue(new Error("투표 기간이 아닙니다."));
  const { user } = renderPage();

  await user.click(await findEnabledVoteButton());
  await user.click(screen.getByRole("button", { name: "Framey 선택" }));
  vi.mocked(getVotePeriod).mockResolvedValue({ ...openPeriod, status: "ENDED" });
  await user.click(screen.getByRole("button", { name: "투표하기" }));
  await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "투표하기" }));

  expect(await screen.findByRole("button", { name: "투표가 마감됐어요." })).toHaveAttribute("aria-disabled", "true");
  expect(screen.queryByRole("button", { name: "Framey 선택" })).not.toBeInTheDocument();
});

it("확인 모달이 열린 채 마감되면 모달을 닫는다", async () => {
  const { user, queryClient } = renderPage();

  await user.click(await findEnabledVoteButton());
  await user.click(screen.getByRole("button", { name: "Framey 선택" }));
  await user.click(screen.getByRole("button", { name: "투표하기" }));
  expect(await screen.findByRole("dialog")).toBeInTheDocument();

  vi.mocked(getVotePeriod).mockResolvedValue({ ...openPeriod, status: "ENDED" });
  await queryClient.refetchQueries();

  expect(await screen.findByRole("button", { name: "투표가 마감됐어요." })).toHaveAttribute("aria-disabled", "true");
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(createVote).not.toHaveBeenCalled();
});
