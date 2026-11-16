import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api/types";

import type { ProjectDetail, ProjectsByZone } from "../types";

export async function getProjects(): Promise<ProjectsByZone> {
  const response = await api.get("api/v1/projects").json<ApiResponse<ProjectsByZone>>();
  return response.data;
}

export async function getProject(id: number): Promise<ProjectDetail> {
  const response = await api.get(`api/v1/projects/${id}`).json<ApiResponse<ProjectDetail>>();
  return response.data;
}
