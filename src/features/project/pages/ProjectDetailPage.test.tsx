import { screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";

import { getProject } from "../api/project.api";
import type { ProjectDetail } from "../types";
import { ProjectDetailPage } from "./ProjectDetailPage";

vi.mock("../api/project.api");
vi.mock("next/navigation", () => ({ useParams: () => ({ id: "3" }) }));

const project: ProjectDetail = {
  id: 3,
  title: "Framey",
  teamName: "간지팀",
  summary: "한줄소개",
  description: "상세 설명",
  serviceUrl: "https://example.com",
  thumbnailUrl: "/thumbnail.webp",
  techStack: "React, Spring Boot",
  platform: "WEB",
  members: [
    { part: "PLAN", names: ["김기획"] },
    { part: "DESIGN", names: [] },
    { part: "SERVER", names: ["이서버"] },
  ],
};

it("프로젝트 정보와 파트별 팀원을 보여준다", async () => {
  vi.mocked(getProject).mockResolvedValue(project);

  renderWithProviders(<ProjectDetailPage />);

  expect(await screen.findByRole("heading", { name: "Framey" })).toBeInTheDocument();
  expect(getProject).toHaveBeenCalledWith(3);
  expect(screen.getByText("김기획")).toBeInTheDocument();
  expect(screen.queryByText("DESIGN")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /서비스 바로가기/ })).toHaveAttribute("href", "https://example.com");
  expect(screen.getByRole("link", { name: "프로젝트 목록으로 돌아가기" })).toHaveAttribute("href", "/projects");
});

it("서비스 주소가 없으면 바로가기를 보여주지 않는다", async () => {
  vi.mocked(getProject).mockResolvedValue({ ...project, serviceUrl: null });

  renderWithProviders(<ProjectDetailPage />);

  await screen.findByRole("heading", { name: "Framey" });
  expect(screen.queryByRole("link", { name: /서비스 바로가기/ })).not.toBeInTheDocument();
});

it("불러오는 동안에도 뒤로 가기는 보이고, 본문 자리는 스켈레톤으로 채운다", async () => {
  const { promise, resolve } = Promise.withResolvers<ProjectDetail>();
  vi.mocked(getProject).mockReturnValueOnce(promise);

  renderWithProviders(<ProjectDetailPage />);

  expect(screen.getByRole("link", { name: "프로젝트 목록으로 돌아가기" })).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("프로젝트 상세 불러오는 중");

  resolve(project);

  expect(await screen.findByRole("heading", { name: "Framey" })).toBeInTheDocument();
  expect(screen.queryByText("프로젝트 상세 불러오는 중")).not.toBeInTheDocument();
});
