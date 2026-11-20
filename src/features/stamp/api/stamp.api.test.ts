import { afterEach, describe, expect, it, vi } from "vitest";

import { collectStamp, toLocalDateTime } from "./stamp.api";

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
    respondWith({ data: { boothId: 2, alreadyCollected: false } });

    await expect(collectStamp("token")).resolves.toEqual({ status: "collected", boothId: 2 });
  });

  it("이미 받은 부스면 그 부스와 함께 이미 받았다고 알려준다", async () => {
    respondWith({ data: { boothId: 1, alreadyCollected: true } });

    await expect(collectStamp("token")).resolves.toEqual({ status: "already-collected", boothId: 1 });
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

describe("toLocalDateTime", () => {
  it("기기 로컬 시각으로 다시 읽으면 같은 초를 가리키는 타임존 없는 문자열을 만든다", () => {
    const date = new Date(2026, 10, 21, 13, 0, 59, 500);

    expect(toLocalDateTime(date)).toBe("2026-11-21T13:00:59");
    expect(new Date(toLocalDateTime(date)).getTime()).toBe(new Date(2026, 10, 21, 13, 0, 59).getTime());
  });
});
