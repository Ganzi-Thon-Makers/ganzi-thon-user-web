import { BOOTH_ZONE_CODES, type BoothListResponse, type BoothListItem, type BoothZone } from "../types";

export function selectBoothZones({ booths: boothsByZone }: BoothListResponse): BoothZone[] {
  return BOOTH_ZONE_CODES.flatMap((code) => {
    const booths = boothsByZone[code];
    if (!booths?.length) return [];

    const boothsByRoom = new Map<string, BoothListItem[]>();

    for (const booth of booths) {
      const roomBooths = boothsByRoom.get(booth.roomNumber);

      if (roomBooths) {
        roomBooths.push(booth);
      } else {
        boothsByRoom.set(booth.roomNumber, [booth]);
      }
    }

    const rooms = [...boothsByRoom]
      // zone에서 호실이 2개 이상일 때 항상 작은 호실의 탭을 먼저 보여주기 위해 localeCompare 사용
      .toSorted(([first], [second]) => first.localeCompare(second, "ko", { numeric: true }))
      .map(([number, roomBooths]) => ({
        number,
        // 부스 번호 순서대로 렌더링할 수 있도록 한 번 더 정렬
        booths: roomBooths.toSorted((first, second) => first.boothNumber - second.boothNumber),
      }));

    return [{ code, rooms }];
  });
}
