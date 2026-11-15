/** 서버 연동 전에도 요청 지연을 재현하고 데이터 원본을 보호한다. */
export function mockResponse<T>(data: T, delayMs = 300): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), delayMs);
  });
}
