import { screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { PageBoundary } from "@/shared/components/PageBoundary";
import { renderWithProviders } from "@/shared/test/render";

import { getProjects } from "../api/project.api";
import type { Project } from "../types";
import { ProjectList } from "./ProjectList";

vi.mock("../api/project.api");

function makeProject(id: number, title: string): Project {
  return { id, title, summary: `${title} 소개`, platform: "WEB", thumbnailUrl: "/thumbnail.webp", isVoted: false };
}

it("선택한 구역의 프로젝트를 카드 목록으로 보여준다", async () => {
  vi.mocked(getProjects).mockResolvedValue({
    ZONE1: [makeProject(9, "Other")],
    ZONE2: [makeProject(1, "Framey"), makeProject(2, "Ganzi")],
  });

  renderWithProviders(<ProjectList zone="ZONE2" />);

  expect(await screen.findAllByRole("listitem")).toHaveLength(2);
  expect(screen.getByRole("heading", { name: "Ganzi" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Other" })).not.toBeInTheDocument();
});

it("선택한 구역에 프로젝트가 없으면 빈 상태 문구를 보여준다", async () => {
  vi.mocked(getProjects).mockResolvedValue({ ZONE1: [makeProject(9, "Other")] });

  renderWithProviders(<ProjectList zone="ZONE2" />);

  expect(await screen.findByText("등록된 프로젝트가 없어요.")).toBeInTheDocument();
  expect(screen.queryByRole("list")).not.toBeInTheDocument();
});

it("목록 조회에 실패하면 에러 화면과 다시 시도 버튼을 보여준다", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(getProjects).mockRejectedValue(new Error("network"));

  renderWithProviders(
    <PageBoundary>
      <ProjectList zone="ZONE2" />
    </PageBoundary>,
  );

  expect(await screen.findByRole("alert")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "다시 시도" })).toBeInTheDocument();
  expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  vi.restoreAllMocks();
});

it("카드를 누르면 해당 프로젝트 상세로 이동하는 링크다", async () => {
  vi.mocked(getProjects).mockResolvedValue({ ZONE2: [makeProject(7, "Framey")] });

  renderWithProviders(<ProjectList zone="ZONE2" />);

  expect(await screen.findByRole("link", { name: /Framey/ })).toHaveAttribute("href", "/projects/7");
});
