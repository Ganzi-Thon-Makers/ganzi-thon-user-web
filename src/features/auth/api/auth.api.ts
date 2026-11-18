import { localApi } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api/types";

import type { LoginRequest, SessionResponse } from "../types";

export async function login(request: LoginRequest): Promise<SessionResponse> {
  const response = await localApi.post("/api/auth/login", { json: request }).json<ApiResponse<SessionResponse>>();
  return response.data;
}
