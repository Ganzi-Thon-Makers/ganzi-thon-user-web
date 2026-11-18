export interface MyPageProfile {
  name: string;
  loginId: string;
}

export interface MyPageTeam {
  name: string;
  memberGroups: readonly {
    part: "PLAN" | "DESIGN" | "WEB" | "APP" | "SERVER";
    members: readonly { id: number; name: string }[];
  }[];
}
