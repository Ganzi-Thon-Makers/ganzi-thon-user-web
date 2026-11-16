import type { MyPageProfile, MyPageTeam } from "../types";

export const mockMyPageProfile: MyPageProfile = {
  name: "사용자 이름",
  loginId: "dkssudgkdpty",
};

export const mockMyPageTeam: MyPageTeam = {
  name: "N팀",
  memberGroups: [
    {
      part: "PLAN",
      members: [
        { id: 1, name: "김간지" },
        { id: 2, name: "김간지" },
      ],
    },
    {
      part: "DESIGN",
      members: [
        { id: 3, name: "김간지" },
        { id: 4, name: "김간지" },
      ],
    },
    {
      part: "WEB",
      members: [
        { id: 5, name: "김간지" },
        { id: 6, name: "김간지" },
      ],
    },
    {
      part: "SERVER",
      members: [
        { id: 7, name: "김간지" },
        { id: 8, name: "김간지" },
      ],
    },
  ],
};
