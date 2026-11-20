import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api/types";

import type { ProjectDetail, ProjectsByZone, VotePeriod } from "../types";

export async function getProjects(): Promise<ProjectsByZone> {
  const response = await api.get("api/v1/projects").json<ApiResponse<ProjectsByZone>>();
  return response.data;
}

export async function getProject(id: number): Promise<ProjectDetail> {
  const response = await api.get(`api/v1/projects/${id}`).json<ApiResponse<ProjectDetail>>();
  return response.data;
}

export async function getMyProject(): Promise<ProjectDetail> {
  const response = await api.get("api/v1/projects/me").json<ApiResponse<ProjectDetail>>();
  return response.data;
}

export async function getVotePeriod(): Promise<VotePeriod> {
  const response = await api.get("api/v1/votes/period").json<ApiResponse<VotePeriod>>();
  return response.data;
}

/** 참가자만, 사용자당 1표, 본인 팀 투표 불가, 투표 시간에만 가능 (VOTE-01) */
export async function createVote(projectId: number): Promise<void> {
  await api.post("api/v1/votes", { json: { projectId } });
}
