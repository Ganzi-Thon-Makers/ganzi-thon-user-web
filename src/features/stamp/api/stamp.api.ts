import { api } from "@/shared/api/client";
import { mockNow, mockResponse } from "@/shared/api/mock";
import type { ApiResponse } from "@/shared/api/types";

import type { OperatorBooth, Stamp, StampToken, StampZone } from "../types";
import { MOCK_USER_ID, mockStampZones, mockStamps, readMockStampToken } from "./stamp.mock";

// TODO: 서버 API가 나오면 api.get/post("...")로 교체한다.
export function getMyStamps(): Promise<Stamp[]> {
  return mockResponse(mockStamps.filter((stamp) => stamp.userId === MOCK_USER_ID));
}

/** 스탬프판 구역과 구역별 부스 목록 */
export function getStampZones(): Promise<StampZone[]> {
  return mockResponse(mockStampZones);
}

/**
 * QR 토큰으로 스탬프를 받은 결과. 화면이 경우마다 다르게 안내해서 에러 대신 결과로 돌려준다.
 * 서버(PR #15) 응답과의 대응: 200 → collected, 409 → already-collected,
 * 400 QR_TOKEN_EXPIRED → expired, 400 QR_TOKEN_NOT_FOUND → invalid-token, 429 → cooldown
 */
export type CollectStampResult =
  | { status: "collected"; boothId: number }
  | { status: "already-collected"; boothId: number }
  | { status: "expired" }
  | { status: "invalid-token" }
  | { status: "cooldown" };

/** 같은 부스 스탬프는 한 번만 받을 수 있다. (서버 unique 제약) */
export function collectStamp(token: string): Promise<CollectStampResult> {
  const boothId = readMockStampToken(token);
  const isBoardBooth = mockStampZones.some((zone) => zone.booths.some((booth) => booth.boothId === boothId));
  if (boothId === null || !isBoardBooth) return mockResponse({ status: "invalid-token" });

  const exists = mockStamps.some((stamp) => stamp.userId === MOCK_USER_ID && stamp.boothId === boothId);
  if (exists) return mockResponse({ status: "already-collected", boothId });

  const now = mockNow();
  mockStamps.push({ id: mockStamps.length + 1, createdAt: now, updatedAt: now, userId: MOCK_USER_ID, boothId });
  return mockResponse({ status: "collected", boothId });
}

interface MyProjectResponse {
  title: string;
}

/** QR 발급 화면 제목. 팀 계정이 속한 프로젝트의 서비스 이름 */
export async function getOperatorBooth(): Promise<OperatorBooth> {
  const response = await api.get("api/v1/projects/me").json<ApiResponse<MyProjectResponse>>();
  return { serviceName: response.data.title };
}

interface QrTokenResponse {
  token: string;
  ttlSeconds: number;
}

/** 팀 계정 부스의 스탬프 QR 토큰을 새로 발급한다. 서버가 계정의 프로젝트로 부스를 찾는다 (STAMP-01-2) */
export async function issueStampToken(): Promise<StampToken> {
  const response = await api.post("api/v1/qr-tokens").json<ApiResponse<QrTokenResponse>>();
  // 서버 expiresAt은 타임존 없는 시각이고 서버가 LocalDateTime.now()(JVM 기본 시간대)로 만들어 기기 시각과 어긋날 수 있음.
  // 받은 시점 + ttlSeconds로 기기 기준 만료 시각을 만듦
  const expiresAt = new Date(Date.now() + response.data.ttlSeconds * 1000);
  return { token: response.data.token, expiresAt: toLocalDateTime(expiresAt) };
}

/** 화면이 기기 로컬 시각으로 읽는, 타임존 없는 시각 문자열 */
export function toLocalDateTime(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 19);
}
