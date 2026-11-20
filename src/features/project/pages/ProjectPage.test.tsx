import { act, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";
import { ToastProvider } from "@/shared/ui/Toast";

import { createVote, getMyProject, getProjects, getVotePeriod } from "../api/project.api";
import { projectQueries } from "../api/project.queries";
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
function serverError(status: number, code: string, message: string) {
  return Object.assign(new Error(code), {
    name: "HTTPError",
    isKyError: true,
    response: { status },
    data: { code, message },
  });
}

/** 테스트에서 응답 시점을 직접 정하는 promise */
function deferred<T>() {
  let resolve: (value: T) => void = () => {};
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
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
  const doneButton = await screen.findByRole("button", { name: "Framey팀에게 투표 완료되었어요" });
  expect(doneButton).toHaveAttribute("aria-disabled", "true");
  // 완료 모달이 닫히면 결과 문구가 있는 하단 버튼으로 포커스가 돌아옴
  await waitFor(() => expect(doneButton).toHaveFocus());
});

it("투표 후 목록과 기간을 모두 다시 받은 뒤에 완료 모달을 띄운다", async () => {
  const projects = deferred<Awaited<ReturnType<typeof getProjects>>>();
  const period = deferred<VotePeriod>();
  vi.mocked(createVote).mockImplementation(async () => {
    vi.mocked(getProjects).mockReturnValue(projects.promise);
    vi.mocked(getVotePeriod).mockReturnValue(period.promise);
  });
  const { user, queryClient } = renderPage();

  await user.click(await findEnabledVoteButton());
  await user.click(screen.getByRole("button", { name: "Framey 선택" }));
  await user.click(screen.getByRole("button", { name: "투표하기" }));
  await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "투표하기" }));
  await waitFor(() => expect(getProjects).toHaveBeenCalledTimes(2));

  const votedProjects = { ZONE1: [makeProject(1, "Framey", true)] };
  projects.resolve(votedProjects);
  await waitFor(() => expect(queryClient.getQueryData(projectQueries.list().queryKey)).toEqual(votedProjects));
  // 다시 받는 동안 확인 모달이 남아 있다가 완료 모달로 이어짐
  expect(screen.getByText("이 프로젝트에게 투표할까요?")).toBeInTheDocument();
  expect(screen.queryByText("투표가 완료되었습니다.")).not.toBeInTheDocument();

  period.resolve(openPeriod);
  expect(await screen.findByText("투표가 완료되었습니다.")).toBeInTheDocument();
});

it("투표 후 목록을 다시 받지 못해도 완료 상태를 유지한다", async () => {
  vi.mocked(createVote).mockImplementation(async () => {
    vi.mocked(getProjects).mockRejectedValue(new Error("network"));
  });
  const { user } = renderPage();

  await user.click(await findEnabledVoteButton());
  await user.click(screen.getByRole("button", { name: "Framey 선택" }));
  await user.click(screen.getByRole("button", { name: "투표하기" }));
  await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "투표하기" }));

  expect(await screen.findByText("투표가 완료되었습니다.")).toBeInTheDocument();
  await user.keyboard("{Escape}");
  expect(await screen.findByRole("button", { name: "Framey팀에게 투표 완료되었어요" })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
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

it("투표 규칙으로 거절되면 서버 안내 문구를 보여 준다", async () => {
  vi.mocked(createVote).mockRejectedValue(serverError(403, "VOTE_PARTICIPANT_ONLY", "투표는 참가자만 할 수 있습니다."));
  const { user } = renderPage();

  await user.click(await findEnabledVoteButton());
  await user.click(screen.getByRole("button", { name: "Framey 선택" }));
  await user.click(screen.getByRole("button", { name: "투표하기" }));
  await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "투표하기" }));

  expect(await screen.findByText("투표는 참가자만 할 수 있습니다.")).toBeInTheDocument();
});

it("내 프로젝트를 받기 전에 고른 본인 팀은 확인 전에 다시 막는다", async () => {
  const mine = deferred<ProjectDetail | null>();
  vi.mocked(getMyProject).mockReturnValue(mine.promise);
  const { user, queryClient } = renderPage();

  await user.click(await findEnabledVoteButton());
  await user.click(screen.getByRole("button", { name: "우리팀 선택" }));
  await act(async () => mine.resolve(myProject));
  await waitFor(() => expect(queryClient.getQueryData(projectQueries.mine().queryKey)).toEqual(myProject));
  await user.click(screen.getByRole("button", { name: "투표하기" }));

  expect(await screen.findByText("본인이 참여한 프로젝트에는 투표할 수 없어요.")).toBeInTheDocument();
  // 토스트도 dialog 역할이라 확인 모달은 제목으로 확인
  expect(screen.queryByText("이 프로젝트에게 투표할까요?")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "우리팀 선택" })).toHaveAttribute("aria-pressed", "false");
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

  expect(await screen.findByRole("button", { name: "Framey팀에게 투표 완료되었어요" })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
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

it("일시중지 후 재개돼도 이전 선택과 확인 모달이 다시 나타나지 않는다", async () => {
  const { user, queryClient } = renderPage();

  await user.click(await findEnabledVoteButton());
  await user.click(screen.getByRole("button", { name: "Framey 선택" }));
  await user.click(screen.getByRole("button", { name: "투표하기" }));
  expect(await screen.findByRole("dialog")).toBeInTheDocument();

  vi.mocked(getVotePeriod).mockResolvedValue({ ...openPeriod, status: "PAUSED" });
  await queryClient.refetchQueries();
  await screen.findByRole("button", { name: "투표가 마감됐어요." });

  vi.mocked(getVotePeriod).mockResolvedValue(openPeriod);
  await queryClient.refetchQueries();

  expect(await screen.findByRole("button", { name: "인기투표" })).toHaveAttribute("aria-disabled", "false");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Framey 선택" })).not.toBeInTheDocument();
});

it("투표한 뒤 마감돼도 투표한 팀을 보여 준다", async () => {
  vi.mocked(getProjects).mockResolvedValue({ ZONE1: [makeProject(1, "Framey", true), makeProject(2, "우리팀")] });
  vi.mocked(getVotePeriod).mockResolvedValue({ ...openPeriod, status: "ENDED" });
  renderPage();

  expect(await screen.findByRole("button", { name: "Framey팀에게 투표 완료되었어요" })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
});

it("투표한 프로젝트가 있는 구역 탭을 먼저 보여 주고 그 카드를 투표한 프로젝트로 알린다", async () => {
  vi.mocked(getProjects).mockResolvedValue({
    ZONE1: [makeProject(2, "우리팀")],
    ZONE2: [makeProject(1, "Framey", true)],
  });
  const { user } = renderPage();

  await waitFor(() => expect(screen.getByRole("tab", { name: "Zone2" })).toHaveAttribute("aria-selected", "true"));
  expect(await screen.findByRole("link", { name: /Framey.*투표한 프로젝트/ })).toBeInTheDocument();

  await user.click(screen.getByRole("tab", { name: "Zone1" }));
  expect(screen.getByRole("tab", { name: "Zone1" })).toHaveAttribute("aria-selected", "true");
});
