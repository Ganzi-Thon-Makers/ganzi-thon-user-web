import { api } from "@/shared/api/client";
import { type ApiResponse } from "@/shared/api/types";

import type { TimetableResponse } from "../types";

export async function getTimetable(): Promise<TimetableResponse> {
  const response = await api.get<ApiResponse<TimetableResponse>>("/api/v1/timetable").json();
  return response.data;
}
