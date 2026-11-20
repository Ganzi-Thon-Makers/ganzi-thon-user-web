// 서버 stamp.zone-completion-threshold. API 응답에는 기준값이 내려오지 않는다.
export const ZONE_COMPLETION_COUNT = 5;

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

/** QR 발급 화면의 부스. 제목에 쓰는 서비스 이름은 `GET /api/v1/projects/me`의 `title` (STAMP-01-2) */
export interface OperatorBooth {
  serviceName: string;
}

/** 부스 운영자가 발급한 스탬프 QR 토큰. expiresAt은 서버 LocalDateTime 형식 */
export interface StampToken {
  token: string;
  expiresAt: string;
}
