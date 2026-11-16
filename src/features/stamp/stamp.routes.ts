// TODO: 부스 화면이 위치를 받는 방식(경로·파라미터 이름)이 정해지면 맞춘다.
// 지금은 부스 배치도(/booths)가 쿼리로 부스 id를 받아 해당 위치를 보여준다고 가정한다.
const BOOTH_MAP_PATH = "/booths";
const BOOTH_ID_PARAM = "boothId";

/** 기능 명세서 STAMP-02: 미수집 부스를 누르면 배치도의 해당 위치로 이동 */
export function getBoothMapHref(boothId: number): string {
  return `${BOOTH_MAP_PATH}?${new URLSearchParams({ [BOOTH_ID_PARAM]: String(boothId) })}`;
}
