import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api/types";

import type { ProjectDetail, ProjectsByZone, VoteStatus } from "../types";
import { mockVoteStatus } from "./project.mock";

export async function getProjects(): Promise<ProjectsByZone> {
  const response = await api.get("api/v1/projects").json<ApiResponse<ProjectsByZone>>();
  return response.data;
}

export async function getProject(id: number): Promise<ProjectDetail> {
  const response = await api.get(`api/v1/projects/${id}`).json<ApiResponse<ProjectDetail>>();
  return response.data;
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
