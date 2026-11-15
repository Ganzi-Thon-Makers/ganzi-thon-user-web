import { screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { renderWithProviders } from "@/shared/test/render";

import { getProjects } from "../api/project.api";
import type { Project } from "../types";
import { ProjectList } from "./ProjectList";

vi.mock("../api/project.api");

function makeProject(id: number, title: string): Project {
  return { id, zone: "ZONE2", title, summary: `${title} 소개`, platform: "WEB", thumbnailUrl: "/thumbnail.webp" };
}

it("선택한 구역의 프로젝트를 카드 목록으로 보여준다", async () => {
  vi.mocked(getProjects).mockResolvedValue([makeProject(1, "Framey"), makeProject(2, "Ganzi")]);

  renderWithProviders(<ProjectList zone="ZONE2" />);

  expect(await screen.findAllByRole("listitem")).toHaveLength(2);
  expect(screen.getByRole("heading", { name: "Ganzi" })).toBeInTheDocument();
  expect(getProjects).toHaveBeenCalledWith("ZONE2");
});
