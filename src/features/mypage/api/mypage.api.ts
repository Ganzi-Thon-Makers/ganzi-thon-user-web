import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api/types";

import { type MyPageResponse } from "../types";

export async function getMyPage(): Promise<MyPageResponse> {
  const response = await api.get<ApiResponse<MyPageResponse>>("/api/v1/user/mypage").json();
  return response.data;
}

export async function logout(): Promise<void> {
  const url = new URL("/api/auth/logout", window.location.origin);
  await api.post(url);
}
