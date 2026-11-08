import { isHTTPError, isNetworkError, isTimeoutError } from "ky";

/** 화면에서 다루는 에러는 이 형태 하나로 맞춘다. */
export interface ApiError {
  status: number | null;
  code: string;
  message: string;
}

/** 백엔드 에러 응답 형식이 확정되면 여기만 맞춘다. */
interface ErrorBody {
  code?: string;
  message?: string;
}

export function toApiError(error: unknown): ApiError {
  if (isHTTPError(error)) {
    const body = (error.data ?? {}) as ErrorBody;
    return {
      status: error.response.status,
      code: body.code ?? `HTTP_${error.response.status}`,
      message: body.message ?? "요청을 처리하지 못했습니다.",
    };
  }
  if (isTimeoutError(error)) {
    return { status: null, code: "TIMEOUT", message: "응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요." };
  }
  if (isNetworkError(error)) {
    return { status: null, code: "NETWORK", message: "네트워크 연결을 확인해 주세요." };
  }
  return { status: null, code: "UNKNOWN", message: "알 수 없는 오류가 발생했습니다." };
}
