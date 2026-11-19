import type { Part } from "@/shared/api/types";

export interface MyPageResponse {
  userId: number;
  name: string;
  loginId: string;
  teamNumber: number;
  teamMemberList: {
    name: string;
    part: Part;
  }[];
}
