import type { Project, ProjectDetail, Zone } from "../types";
import { mockProjects } from "./project.mock";

// TODO: 서버 API가 나오면 api.get("...")으로 교체한다.
export function getProjects(zone: Zone): Promise<Project[]> {
  return Promise.resolve(mockProjects.filter((project) => project.zone === zone));
}

export function getProject(id: number): Promise<ProjectDetail> {
  const project = mockProjects.find((item) => item.id === id);
  if (!project) return Promise.reject(new Error("프로젝트를 찾을 수 없습니다."));
  return Promise.resolve(project);
}
