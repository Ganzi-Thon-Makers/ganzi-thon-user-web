import { afterEach, describe, expect, it, vi } from "vitest";

import { collectStamp, issueStampToken } from "./stamp.api";

// collectStamp가 공용 api 인스턴스를 써서 fetch를 주입할 수 없어 전역 fetch로 서버 응답을 대신함
function respondWith(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn<typeof fetch>(async () => Response.json(body, { status })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("collectStamp", () => {
  it("새로 적립하면 적립한 부스를 알려준다", async () => {
    respondWith({
      data: {
        boothId: 2,
        alreadyCollected: false,
        collectedCount: 15,
        luckyDrawEntered: true,
        luckyDrawJustEntered: true,
      },
    });

    await expect(collectStamp("token")).resolves.toEqual({
      status: "collected",
      boothId: 2,
      collectedCount: 15,
      luckyDrawEntered: true,
      luckyDrawJustEntered: true,
    });
  });

  it("이미 받은 부스면 그 부스와 함께 이미 받았다고 알려준다", async () => {
    respondWith({
      data: {
        boothId: 1,
        alreadyCollected: true,
        collectedCount: 1,
        luckyDrawEntered: false,
        luckyDrawJustEntered: false,
      },
    });

    await expect(collectStamp("token")).resolves.toEqual({
      status: "already-collected",
      boothId: 1,
      collectedCount: 1,
      luckyDrawEntered: false,
      luckyDrawJustEntered: false,
    });
  });

  it.each([
    ["QR_TOKEN_EXPIRED", 400, "expired"],
    ["QR_TOKEN_NOT_FOUND", 400, "invalid-token"],
    ["STAMP_OWN_BOOTH", 400, "own-booth"],
    ["STAMP_COOLDOWN", 429, "cooldown"],
  ])("%s 에러는 %s 결과로 바꾼다", async (code, status, expected) => {
    respondWith({ status, code, message: "msg" }, status);

    await expect(collectStamp("token")).resolves.toEqual({ status: expected });
  });

  it("그 밖의 에러는 요청 실패로 던진다", async () => {
    respondWith({ status: 403, code: "STAMP_PARTICIPANT_ONLY", message: "msg" }, 403);

    await expect(collectStamp("token")).rejects.toMatchObject({ name: "HTTPError" });
  });
});

it.each([
  ["2026-11-21T13:01:00.039072194", "2026-11-21T13:01:00.039+09:00"],
  ["2026-11-21T13:01:00", "2026-11-21T13:01:00+09:00"],
])("서버 만료 시각 %s를 밀리초까지 사용하고 한국 시간을 적용한다", async (expiresAt, expected) => {
  respondWith({ data: { token: "token", expiresAt, ttlSeconds: 60 } });

  await expect(issueStampToken()).resolves.toEqual({ token: "token", expiresAt: expected });
});
