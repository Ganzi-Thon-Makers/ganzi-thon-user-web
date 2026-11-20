import { type StampBoard, type StampZoneCode, ZONE_COMPLETION_COUNT, type ZoneStampStatus } from "./types";

/** 테스트용 구역. 부스 이름은 `<boothId>팀`이다. */
export function makeZoneStatus(zone: StampZoneCode, boothIds: number[], collectedIds: number[] = []): ZoneStampStatus {
  const booths = boothIds.map((boothId) => ({
    boothId,
    boothName: `${boothId}팀`,
    boothNumber: boothId,
    collected: collectedIds.includes(boothId),
  }));
  const collectedCount = booths.filter((booth) => booth.collected).length;
  return {
    zone,
    totalBooths: booths.length,
    collectedCount,
    completed: collectedCount >= ZONE_COMPLETION_COUNT,
    booths,
  };
}

/** 테스트용 스탬프판. 기본은 빈 구역 없이 개수만 담는다. */
export function makeStampBoard({
  collectedCount = 0,
  luckyDrawEntered = collectedCount >= 15,
  zoneStatuses = [],
}: Partial<StampBoard> = {}): StampBoard {
  return { collectedCount, luckyDrawEntered, zoneStatuses };
}
