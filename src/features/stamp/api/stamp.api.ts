import { api } from "@/shared/api/client";
import { toApiError } from "@/shared/api/error";
import type { ApiResponse } from "@/shared/api/types";

import type { OperatorBooth, StampBoard, StampToken, StampZoneCode } from "../types";

/** 내 스탬프판: 구역별 전체 부스와 적립 여부, 럭키드로우 진행 */
export async function getStampBoard(): Promise<StampBoard> {
  const response = await api.get("api/v1/stamps").json<ApiResponse<StampBoard>>();
  return response.data;
}

interface MyStampBooth {
  teamName: string;
  zone: StampZoneCode;
  boothNumber: number;
}

export async function getMyStampBooth(): Promise<MyStampBooth | null> {
  try {
    const { data } = await api.get("api/v1/projects/me").json<ApiResponse<MyStampBooth>>();
    return data;
  } catch (error) {
    const { code } = toApiError(error);
    if (code === "PROJECT_NOT_FOUND" || code === "BOOTH_NOT_FOUND") return null;
    throw error;
  }
}

/** 서버 StampCollectResponse 중 화면이 쓰는 필드 */
interface StampCollectResponse {
  boothId: number;
  alreadyCollected: boolean;
  collectedCount: number;
  luckyDrawEntered: boolean;
  luckyDrawJustEntered: boolean;
}

/** QR 토큰으로 스탬프를 받은 결과. 화면이 경우마다 다르게 안내해서 에러 대신 결과로 돌려준다 */
export type CollectStampResult =
  | (Omit<StampCollectResponse, "alreadyCollected"> & { status: "collected" | "already-collected" })
  | { status: "expired" }
  | { status: "invalid-token" }
  | { status: "cooldown" }
  | { status: "own-booth" };

// 서버 ErrorCode → 결과. 그 밖의 에러(참가자 아님·5xx 등)는 요청 실패로 던짐
const COLLECT_FAILURE_BY_CODE: Record<string, Exclude<CollectStampResult, { boothId: number }>> = {
  QR_TOKEN_EXPIRED: { status: "expired" },
  QR_TOKEN_NOT_FOUND: { status: "invalid-token" },
  STAMP_COOLDOWN: { status: "cooldown" },
  STAMP_OWN_BOOTH: { status: "own-booth" },
};

/** 같은 부스는 한 번만 적립된다. 이미 받은 부스면 서버가 200 + alreadyCollected로 알려준다 */
export async function collectStamp(token: string): Promise<CollectStampResult> {
  try {
    const { data } = await api.post("api/v1/stamps", { json: { token } }).json<ApiResponse<StampCollectResponse>>();
    return {
      status: data.alreadyCollected ? "already-collected" : "collected",
      boothId: data.boothId,
      collectedCount: data.collectedCount,
      luckyDrawEntered: data.luckyDrawEntered,
      luckyDrawJustEntered: data.luckyDrawJustEntered,
    };
  } catch (error) {
    const failure = COLLECT_FAILURE_BY_CODE[toApiError(error).code];
    if (failure) return failure;
    throw error;
  }
}

interface MyProjectResponse {
  title: string;
}

/** QR 발급 화면 제목. 팀 계정이 속한 프로젝트의 서비스 이름 */
export async function getOperatorBooth(): Promise<OperatorBooth> {
  const response = await api.get("api/v1/projects/me").json<ApiResponse<MyProjectResponse>>();
  return { serviceName: response.data.title };
}

/** 팀 계정 부스의 스탬프 QR 토큰을 새로 발급한다. 서버가 계정의 프로젝트로 부스를 찾는다 (STAMP-01-2) */
export async function issueStampToken(): Promise<StampToken> {
  const { data } = await api.post("api/v1/qr-tokens").json<ApiResponse<StampToken>>();
  // KST로 내려오는 만료 시각을 밀리초까지만 사용한다.
  const expiresAt = data.expiresAt.slice(0, 23);
  return { token: data.token, expiresAt: `${expiresAt}+09:00` };
}
