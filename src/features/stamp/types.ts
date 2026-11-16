import type { BaseEntity } from "@/shared/api/types";

/** 사용자가 부스를 방문해 받은 스탬프. 사용자·부스 조합당 하나다. */
export interface Stamp extends BaseEntity {
  userId: number;
  boothId: number;
}
