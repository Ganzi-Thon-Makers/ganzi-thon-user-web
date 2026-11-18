import type { Booth, BoothRoom, BoothZone } from "../types";

function makeRoom(number: number, leftCount: number, rightCount: number): BoothRoom {
  const booths = Array.from({ length: leftCount + rightCount }, (_, index): Booth => ({
    id: number * 100 + index + 1,
    title: `서비스 ${index + 1}`,
    teamName: `${number}호 팀 ${index + 1}`,
    summary: `${number}호 부스에서 팀 ${index + 1}의 서비스를 체험해 볼 수 있어요.`,
    thumbnailUrl: "/thumbnail.webp",
    platform: index % 2 === 0 ? "WEB" : "APP",
  }));

  return { number, leftBooths: booths.slice(0, leftCount), rightBooths: booths.slice(leftCount) };
}

// 프로젝트 목록 응답에는 호실과 배치 위치가 없어 목 데이터에서는 Figma 배치도를 따른다.
export const mockBoothZones: BoothZone[] = [
  { code: "ZONE1", rooms: [makeRoom(104, 4, 4)] },
  { code: "ZONE2", rooms: [makeRoom(201, 3, 2), makeRoom(202, 3, 3)] },
  { code: "ZONE3", rooms: [makeRoom(203, 3, 2), makeRoom(204, 3, 3)] },
];
