import type { Project, ProjectDetail, VoteStatus, Zone } from "../types";
import { mockProjects, mockVoteStatus } from "./project.mock";

// TODO: 서버 API가 나오면 api.get("...")으로 교체한다.
export function getProjects(zone: Zone): Promise<Project[]> {
  return Promise.resolve(mockProjects.filter((project) => project.zone === zone));
}

export function getProject(id: number): Promise<ProjectDetail> {
  const project = mockProjects.find((item) => item.id === id);
  if (!project) return Promise.reject(new Error("프로젝트를 찾을 수 없습니다."));
  return Promise.resolve(project);
}

export function getVoteStatus(): Promise<VoteStatus> {
  return Promise.resolve({ ...mockVoteStatus });
}

/** 사용자당 1표, 본인 팀 투표 불가, 투표 기간에만 가능 (VOTE-01) */
export function createVote(projectId: number): Promise<VoteStatus> {
  if (mockVoteStatus.phase !== "OPEN") return Promise.reject(new Error("투표 기간이 아닙니다."));
  if (mockVoteStatus.votedProjectId !== null) return Promise.reject(new Error("이미 투표했습니다."));
  if (mockVoteStatus.myProjectId === projectId) return Promise.reject(new Error("본인 팀에는 투표할 수 없습니다."));

  mockVoteStatus.votedProjectId = projectId;
  return Promise.resolve({ ...mockVoteStatus });
}
