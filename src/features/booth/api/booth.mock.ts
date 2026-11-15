import type { BoothRoom, BoothZone } from "../types";

function makeRoom(number: number, leftCount: number, rightCount: number): BoothRoom {
  const booths = Array.from({ length: leftCount + rightCount }, (_, index) => ({
    id: number * 100 + index + 1,
    title: `서비스 ${index + 1}`,
  }));

  return { number, leftBooths: booths.slice(0, leftCount), rightBooths: booths.slice(leftCount) };
}

// 프로젝트 목록 응답에는 호실과 배치 위치가 없어 목 데이터에서는 Figma 배치도를 따른다.
export const mockBoothZones: BoothZone[] = [
  { code: "ZONE1", rooms: [makeRoom(104, 4, 4)] },
  { code: "ZONE2", rooms: [makeRoom(201, 3, 2), makeRoom(202, 3, 3)] },
  { code: "ZONE3", rooms: [makeRoom(203, 3, 2), makeRoom(204, 3, 3)] },
];
