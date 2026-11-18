import { api } from "@/shared/api/client";
import { toApiError } from "@/shared/api/error";
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

/** 소속 팀이 없으면 서버가 404 PROJECT_NOT_FOUND를 줘서 null로 바꿈 */
export async function getMyProject(): Promise<ProjectDetail | null> {
  try {
    const response = await api.get("api/v1/projects/me").json<ApiResponse<ProjectDetail>>();
    return response.data;
  } catch (error) {
    if (toApiError(error).code === "PROJECT_NOT_FOUND") return null;
    throw error;
  }
}

export async function getVotePeriod(): Promise<VotePeriod> {
  const response = await api.get("api/v1/votes/period").json<ApiResponse<VotePeriod>>();
  return response.data;
}

/** 참가자만, 사용자당 1표, 본인 팀 투표 불가, 투표 시간에만 가능 (VOTE-01) */
export async function createVote(projectId: number): Promise<void> {
  await api.post("api/v1/votes", { json: { projectId } });
}
