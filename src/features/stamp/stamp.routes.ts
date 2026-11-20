// 부스 배치도(BoothPage)가 읽는 쿼리 이름과 같아야 함
const BOOTH_MAP_PATH = "/booths";
const BOOTH_ID_PARAM = "boothId";

export const STAMP_BOARD_PATH = "/stamp";
export const STAMPED_BOOTH_PARAM = "stampedBooth";
// 같은 부스를 다시 적립해도 주소가 달라져 구역 펼침을 새로 정함
export const STAMPED_AT_PARAM = "stampedAt";

// 부스 운영자 QR에 담는 주소. 휴대폰 기본 카메라로 찍어도 이 화면으로 들어와 같은 처리를 거침
export const STAMP_COLLECT_PATH = "/stamp/collect";
const STAMP_TOKEN_PARAM = "token";

/** 기능 명세서 STAMP-02: 미수집 부스를 누르면 배치도의 해당 위치로 이동 */
export function getBoothMapHref(boothId: number): string {
  return `${BOOTH_MAP_PATH}?${new URLSearchParams({ [BOOTH_ID_PARAM]: String(boothId) })}`;
}

/** 스탬프 적립 결과를 보여줄 스탬프판 주소. 부스가 속한 구역을 펼친다 */
export function getStampBoardHref(boothId: number, stampedAt: number): string {
  const params = new URLSearchParams({ [STAMPED_BOOTH_PARAM]: String(boothId), [STAMPED_AT_PARAM]: String(stampedAt) });
  return `${STAMP_BOARD_PATH}?${params}`;
}

/** 부스 QR에 담을 적립 주소. 휴대폰 기본 카메라로 찍어도 열리도록 전체 주소로 만든다 */
export function getStampCollectUrl(origin: string, token: string): string {
  return `${origin}${STAMP_COLLECT_PATH}?${new URLSearchParams({ [STAMP_TOKEN_PARAM]: token })}`;
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
