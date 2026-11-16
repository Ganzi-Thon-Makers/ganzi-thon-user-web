import { mockResponse } from "@/shared/api/mock";

import { mockMyPageProfile, mockMyPageTeam } from "./mypage.mock";

export function getMyPage() {
  return mockResponse({ profile: mockMyPageProfile, team: mockMyPageTeam });
}
