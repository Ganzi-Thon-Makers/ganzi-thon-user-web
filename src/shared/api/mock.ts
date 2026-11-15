/** 실제 요청처럼 약간 늦게 응답하고, 원본이 바뀌지 않도록 복사본을 준다. */
export function mockResponse<T>(data: T, delayMs = 300): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), delayMs);
  });
}
