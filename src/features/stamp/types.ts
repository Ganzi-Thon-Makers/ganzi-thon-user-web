import type { BaseEntity } from "@/shared/api/types";

/** 사용자가 부스를 방문해 받은 스탬프. 사용자·부스 조합당 하나다. */
export interface Stamp extends BaseEntity {
  userId: number;
  boothId: number;
}

/** 스탬프판의 부스 한 칸. 서버 응답 형태는 아직 미정이라 화면에 필요한 필드만 둔다. */
export interface StampBoardBooth {
  boothId: number;
  boothName: string;
}

/** 스탬프판의 구역. requiredCount개를 모으면 구역 수료다. */
export interface StampZone {
  zoneName: string;
  requiredCount: number;
  booths: StampBoardBooth[];
}
