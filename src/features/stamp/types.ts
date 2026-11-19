// 서버 Zone enum
export const STAMP_ZONES = ["ZONE1", "ZONE2", "ZONE3"] as const;
export type StampZoneCode = (typeof STAMP_ZONES)[number];

/** 서버 StampBoardResponse.BoothStamp. 부스에 프로젝트가 없으면 boothName이 null이다. */
export interface BoothStamp {
  boothId: number;
  boothName: string | null;
  boothNumber: number | null;
  collected: boolean;
}

/** 서버 StampBoardResponse.ZoneStatus 중 화면이 쓰는 필드 */
export interface ZoneStampStatus {
  zone: StampZoneCode;
  totalBooths: number;
  collectedCount: number;
  completed: boolean;
  booths: BoothStamp[];
}

/** 서버 StampBoardResponse (GET /api/v1/stamps) */
export interface StampBoard {
  collectedCount: number;
  luckyDrawEntered: boolean;
  zoneStatuses: ZoneStampStatus[];
}
