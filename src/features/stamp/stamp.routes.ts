// TODO: 부스 화면이 위치를 받는 방식(경로·파라미터 이름)이 정해지면 맞춘다.
// 지금은 부스 배치도(/booths)가 쿼리로 부스 id를 받아 해당 위치를 보여준다고 가정한다.
const BOOTH_MAP_PATH = "/booths";
const BOOTH_ID_PARAM = "boothId";

export const STAMP_BOARD_PATH = "/stamp";
export const STAMPED_BOOTH_PARAM = "stampedBooth";

// 부스 운영자 QR에 담는 주소. 휴대폰 기본 카메라로 찍어도 이 화면으로 들어와 같은 처리를 거침
export const STAMP_COLLECT_PATH = "/stamp/collect";
const STAMP_TOKEN_PARAM = "token";

/** 기능 명세서 STAMP-02: 미수집 부스를 누르면 배치도의 해당 위치로 이동 */
export function getBoothMapHref(boothId: number): string {
  return `${BOOTH_MAP_PATH}?${new URLSearchParams({ [BOOTH_ID_PARAM]: String(boothId) })}`;
}

/** 스탬프 적립 결과를 보여줄 스탬프판 주소. 부스가 속한 구역을 펼친다 */
export function getStampBoardHref(boothId: number): string {
  return `${STAMP_BOARD_PATH}?${new URLSearchParams({ [STAMPED_BOOTH_PARAM]: String(boothId) })}`;
}

/** QR 내용이 스탬프 적립 주소면 토큰을, 아니면 null을 돌려준다 */
export function parseStampToken(qrText: string): string | null {
  if (!URL.canParse(qrText)) return null;

  const url = new URL(qrText);
  if (url.pathname !== STAMP_COLLECT_PATH) return null;
  return readStampToken(url.searchParams);
}

/** 적립 화면 주소에서 토큰을 읽는다 */
export function readStampToken(searchParams: URLSearchParams): string | null {
  return searchParams.get(STAMP_TOKEN_PARAM) || null;
}
