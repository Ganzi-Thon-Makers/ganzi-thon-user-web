import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api/types";

import type { BoothDetail, BoothListResponse } from "../types";

export async function getBoothZones(): Promise<BoothListResponse> {
  const response = await api.get<ApiResponse<BoothListResponse>>("/api/v1/booth").json();
  return response.data;
}

export async function getBoothDetail(boothId: number): Promise<BoothDetail> {
  const response = await api.get<ApiResponse<BoothDetail>>(`/api/v1/booth/${boothId}`).json();
  return response.data;
}
