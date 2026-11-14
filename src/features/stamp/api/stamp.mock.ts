import type { Stamp, StampZone } from "../types";

// TODO: 서버 API가 나오면 실제 응답으로 교체한다.
// 서버가 토큰으로 사용자를 구분하는 부분을 목에서는 이 값으로 대신한다.
export const MOCK_USER_ID = 1;

export const mockStamps: Stamp[] = [
  {
    id: 1,
    createdAt: "2026-11-21T13:10:00",
    updatedAt: "2026-11-21T13:10:00",
    userId: MOCK_USER_ID,
    boothId: 1,
  },
  {
    id: 2,
    createdAt: "2026-11-21T13:40:00",
    updatedAt: "2026-11-21T13:40:00",
    userId: MOCK_USER_ID,
    boothId: 3,
  },
];

// Figma(875:48177) 기준 구역별 칸 수 8·11·11(총 30), 구역 수료 기준 3개.
// 부스 이름은 디자인·명세에 없어 임시 값이다. boothId는 1부터 이어서 매긴다.
const ZONE_BOOTH_COUNTS = [8, 11, 11];
const ZONE_REQUIRED_COUNT = 3;

export const mockStampZones: StampZone[] = ZONE_BOOTH_COUNTS.map((boothCount, zoneIndex) => {
  const firstBoothId = ZONE_BOOTH_COUNTS.slice(0, zoneIndex).reduce((sum, count) => sum + count, 0) + 1;
  return {
    zoneName: `Zone ${zoneIndex + 1}`,
    requiredCount: ZONE_REQUIRED_COUNT,
    booths: Array.from({ length: boothCount }, (_, index) => ({
      boothId: firstBoothId + index,
      boothName: `${firstBoothId + index}팀`,
    })),
  };
});
