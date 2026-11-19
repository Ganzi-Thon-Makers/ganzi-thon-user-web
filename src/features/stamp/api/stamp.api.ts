import { api } from "@/shared/api/client";
import { toApiError } from "@/shared/api/error";
import type { ApiResponse } from "@/shared/api/types";

import type { StampBoard } from "../types";

/** 내 스탬프판: 구역별 전체 부스와 적립 여부, 럭키드로우 진행 */
export async function getStampBoard(): Promise<StampBoard> {
  const response = await api.get("api/v1/stamps").json<ApiResponse<StampBoard>>();
  return response.data;
}

/** 서버 StampCollectResponse 중 화면이 쓰는 필드 */
interface StampCollectResponse {
  boothId: number;
  alreadyCollected: boolean;
}

/** QR 토큰으로 스탬프를 받은 결과. 화면이 경우마다 다르게 안내해서 에러 대신 결과로 돌려준다 */
export type CollectStampResult =
  | { status: "collected"; boothId: number }
  | { status: "already-collected"; boothId: number }
  | { status: "expired" }
  | { status: "invalid-token" }
  | { status: "cooldown" }
  | { status: "own-booth" };

// 서버 ErrorCode → 결과. 그 밖의 에러(참가자 아님·5xx 등)는 요청 실패로 던진다
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
    return { status: data.alreadyCollected ? "already-collected" : "collected", boothId: data.boothId };
  } catch (error) {
    const failure = COLLECT_FAILURE_BY_CODE[toApiError(error).code];
    if (failure) return failure;
    throw error;
  }
}
