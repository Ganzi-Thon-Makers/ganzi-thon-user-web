import { api } from "@/shared/api/client";
import { mockResponse } from "@/shared/api/mock";

import { mockMyPageProfile, mockMyPageTeam } from "./mypage.mock";

export function getMyPage() {
  return mockResponse({ profile: mockMyPageProfile, team: mockMyPageTeam });
}

export async function logout(): Promise<void> {
  const url = new URL("/api/auth/logout", window.location.origin);
  await api.post(url);
}
