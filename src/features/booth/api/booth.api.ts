import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api/types";

import type { BoothListResponse } from "../types";

export async function getBoothZones(): Promise<BoothListResponse> {
  const response = await api.get<ApiResponse<BoothListResponse>>("/api/v1/booth").json();
  return response.data;
}
