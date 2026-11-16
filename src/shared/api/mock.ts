/**
 * 서버 API가 나오기 전까지 api 함수에서 목 데이터를 돌려줄 때 쓴다.
 * 실제 요청처럼 약간 늦게 응답하고, 원본이 바뀌지 않도록 복사본을 준다.
 */
export function mockResponse<T>(data: T, delayMs = 300): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), delayMs);
  });
}

/** 목 데이터를 새로 만들 때 쓰는 현재 시각 (서버 LocalDateTime 형식) */
export function mockNow(): string {
  return new Date().toISOString().slice(0, 19);
}
